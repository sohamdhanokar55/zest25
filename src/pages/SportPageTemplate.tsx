import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import RegistrationFormFields from "../components/RegistrationFormFields";
import {
  createOrder,
  loadRazorpay,
  RazorpaySuccessResponse,
} from "../utils/razorpay";
import { EventConfig } from "../config/eventConfig";
import { events } from "../data/events";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SuccessModal from "../components/SuccessModal";

interface SportPageTemplateProps {
  config: EventConfig;
}

const SportPageTemplate = ({ config }: SportPageTemplateProps) => {
  const navigate = useNavigate();
  const event = events.find((e) => e.id === config.eventKey);

  // Team Leader Fields
  const [teamLeaderName, setTeamLeaderName] = useState("");
  const [teamLeaderContact, setTeamLeaderContact] = useState("");
  const [alternateContact, setAlternateContact] = useState("");
  const [group, setGroup] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");

  // Category
  const [category, setCategory] = useState("");
  const [shotPutSubCategory, setShotPutSubCategory] = useState("");

  // Athletics event (single selection)
  const [selectedAthleticsEvent, setSelectedAthleticsEvent] =
    useState<string>("");

  // Relay players (for athletics)
  const needsRelayPlayers =
    config.requiresRelayPlayers &&
    (selectedAthleticsEvent === "Relay" ||
      selectedAthleticsEvent === "Mixed Relay");
  const [relayPlayers, setRelayPlayers] = useState<
    Array<{ name: string; branch: string; semester: string }>
  >([]);
  const [teamLeaderEmail, setTeamLeaderEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [isSubmittingRegistration, setIsSubmittingRegistration] =
    useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(5);
  const [registrationNumber, setRegistrationNumber] = useState<number | null>(
    null
  );
  const [emailStatus, setEmailStatus] = useState<
    "sent" | "failed" | "skipped" | null
  >(null);
  const [isPrePaymentOpen, setIsPrePaymentOpen] = useState(false);

  // Calculate player limits based on category
  const getPlayerLimits = () => {
    if (config.fixedPlayerCount) {
      return { min: config.fixedPlayerCount, max: config.fixedPlayerCount };
    }

    if (config.categoryBasedLimits && category) {
      if (category === "boys" && config.categoryBasedLimits.boys) {
        return config.categoryBasedLimits.boys;
      }
      if (category === "girls" && config.categoryBasedLimits.girls) {
        return config.categoryBasedLimits.girls;
      }
    }

    if (config.minPlayers !== undefined && config.maxPlayers !== undefined) {
      return { min: config.minPlayers, max: config.maxPlayers };
    }

    return { min: 1, max: 1 };
  };

  // Determine player count based on category (for category-based sports)
  const getCategoryPlayerCount = (): number => {
    if (!category) return 1;

    if (category.includes("singles")) return 1;
    if (category.includes("doubles") || category === "mixed") return 2;
    return 1;
  };

  const limits = getPlayerLimits();
  const categoryPlayerCount =
    config.priceType === "categoryBased" ? getCategoryPlayerCount() : null;

  const totalPlayerCount =
    config.fixedPlayerCount || categoryPlayerCount || limits.min || 1;

  // For team sports: Player 1 = Team Leader, so we only ask for additional players
  // If total is 11, we only need 10 additional players (Player 2-11)
  const additionalPlayersNeeded =
    totalPlayerCount > 1 ? totalPlayerCount - 1 : 0;

  const [numberOfPlayers, setNumberOfPlayers] = useState(totalPlayerCount);
  const [players, setPlayers] = useState<
    Array<{ name: string; branch: string; semester: string }>
  >(
    Array(additionalPlayersNeeded)
      .fill(null)
      .map(() => ({ name: "", branch: "", semester: "" }))
  );

  // Calculate effective number of players based on config
  const effectiveNumberOfPlayers =
    config.priceType === "categoryBased" && category
      ? getCategoryPlayerCount()
      : config.fixedPlayerCount || numberOfPlayers;

  // Update players when category changes (for category-based sports)
  useEffect(() => {
    if (config.priceType === "categoryBased" && category) {
      const count = getCategoryPlayerCount();
      setNumberOfPlayers(count);
      // Only ask for additional players (Player 2 onwards)
      const additional = count > 1 ? count - 1 : 0;
      setPlayers(
        Array(additional)
          .fill(null)
          .map(() => ({ name: "", branch: "", semester: "" }))
      );
    }
  }, [category, config.priceType]);

  // Update players when category changes (for category-based limits like basketball)
  useEffect(() => {
    if (config.categoryBasedLimits && category) {
      const newLimits = getPlayerLimits();
      if (numberOfPlayers < newLimits.min) {
        setNumberOfPlayers(newLimits.min);
        // Only ask for additional players (Player 2 onwards)
        const additional = newLimits.min > 1 ? newLimits.min - 1 : 0;
        setPlayers(
          Array(additional)
            .fill(null)
            .map(() => ({ name: "", branch: "", semester: "" }))
        );
      }
    }
  }, [category, config.categoryBasedLimits]);

  // Update relay players when relay events are selected/deselected
  useEffect(() => {
    if (needsRelayPlayers && relayPlayers.length === 0) {
      // Auto-fill first player with team leader info
      const playersArray = Array(4)
        .fill(null)
        .map(() => ({ name: "", branch: "", semester: "" }));
      // Set Player 1 as Team Leader
      playersArray[0] = {
        name: teamLeaderName,
        branch: branch,
        semester: semester,
      };
      setRelayPlayers(playersArray);
    } else if (!needsRelayPlayers && relayPlayers.length > 0) {
      setRelayPlayers([]);
    }
  }, [needsRelayPlayers, teamLeaderName, branch, semester]);

  // Calculate fee
  const calculateFee = (): number => {
    if (config.priceType === "athletics" && config.athleticsEvents) {
      if (!selectedAthleticsEvent) return 0;
      const athleticsEvent = config.athleticsEvents?.find(
        (e) => e.name === selectedAthleticsEvent
      );
      return athleticsEvent?.price || 0;
    }

    if (config.priceType === "categoryBased" && category) {
      return config.categoryPrices?.[category] || 0;
    }

    if (config.priceType === "fixed") {
      return config.fixedPrice || 0;
    }

    // Per player pricing
    return numberOfPlayers * (config.perPlayerPrice || 100);
  };

  const totalFee = calculateFee();

  useEffect(() => {
    if (!isSuccessModalOpen) return;

    setSuccessCountdown(5);
    const interval = setInterval(() => {
      setSuccessCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/");
          window.location.reload();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSuccessModalOpen, navigate]);

  const isSinglePlayerEntry =
    config.eventKey === "chess" ||
    (config.eventKey === "carrom" && category === "singles") ||
    (config.eventKey === "table-tennis" &&
      (category === "singles-boys" || category === "singles-girls")) ||
    (config.eventKey === "badminton" &&
      (category === "singles-boys" || category === "singles-girls")) ||
    (config.eventKey === "athletics" &&
      selectedAthleticsEvent !== "Relay" &&
      selectedAthleticsEvent !== "Mixed Relay");

  const buildPhpSportAndCategory = () => {
    if (config.eventKey !== "athletics") {
      return { sport: config.eventKey, category };
    }

    const eventName = selectedAthleticsEvent.toLowerCase();

    if (eventName === "100m" || eventName === "200m") {
      return { sport: `athletics-${eventName}`, category };
    }

    if (eventName === "400m" || eventName === "800m") {
      return { sport: `athletics-${eventName}`, category };
    }

    if (eventName === "long jump") {
      return { sport: "athletics-long-jump", category };
    }

    if (eventName === "shot put") {
      const gender = shotPutSubCategory || category;
      return { sport: "athletics-shot-put", category: gender || "" };
    }

    if (eventName === "relay") {
      return { sport: "athletics-relay", category };
    }

    if (eventName === "mixed relay") {
      return { sport: "athletics-mixed-relay", category: "" };
    }

    return { sport: config.eventKey, category };
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!teamLeaderEmail || !emailRegex.test(teamLeaderEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(null);

    // Validation
    if (!teamLeaderName || !teamLeaderContact || !alternateContact) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      (config.requiresGender || config.categories) &&
      !category &&
      config.priceType !== "athletics"
    ) {
      alert("Please select a category");
      return;
    }

    if (config.priceType === "athletics" && !selectedAthleticsEvent) {
      alert("Please select an athletics event");
      return;
    }

    if (
      config.requiresShotPutSubCategory &&
      selectedAthleticsEvent === "Shot Put" &&
      !shotPutSubCategory
    ) {
      alert("Please select Shot Put sub-category");
      return;
    }

    if (
      config.dynamicPlayerFields &&
      players.length > 0 &&
      !isSinglePlayerEntry
    ) {
      const incompletePlayers = players.filter(
        (p) => !p.name || !p.branch || !p.semester
      );
      if (incompletePlayers.length > 0) {
        alert("Please fill in all player information");
        return;
      }
    }

    // Validate relay players if relay is selected
    if (needsRelayPlayers) {
      const incompletePlayers = relayPlayers.filter(
        (p) => !p.name || !p.branch || !p.semester
      );
      if (incompletePlayers.length > 0) {
        alert("Please fill in all relay team member information");
        return;
      }
    }

    // All validations passed, open pre-payment modal
    setIsPrePaymentOpen(true);
  };

  const handleStartPayment = async () => {
    try {
      setIsPrePaymentOpen(false);

      await loadRazorpay();
      const order = await createOrder(totalFee);
      const key = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!key) {
        throw new Error("Razorpay key is not configured");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK failed to load");
      }

      let paymentDescription = `${config.title} Registration`;
      if (category && config.priceType !== "athletics") {
        paymentDescription += ` - ${category}`;
      }
      if (config.priceType === "athletics" && selectedAthleticsEvent) {
        paymentDescription += ` - ${selectedAthleticsEvent}`;
      }
      if (effectiveNumberOfPlayers > 0 && config.priceType !== "athletics") {
        paymentDescription += ` - ${effectiveNumberOfPlayers} player(s)`;
      }

      setIsLoadingPayment(true);

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: config.title,
        description: paymentDescription,
        order_id: order.order_id,
        handler: async (response: RazorpaySuccessResponse) => {
          console.log("Razorpay payment successful", response);

          try {
            setIsLoadingPayment(false);
            setIsSubmittingRegistration(true);

            const base = buildPhpSportAndCategory();

            // Normalize sport/category to lowercase as required
            const sport = base.sport.toLowerCase();
            const phpCategory = (base.category || "").toLowerCase();

            // Build players payload expected by PHP API
            const buildPlayersPayload = () => {
              // Athletics relay / mixed relay: use relay players
              if (
                config.eventKey === "athletics" &&
                (selectedAthleticsEvent === "Relay" ||
                  selectedAthleticsEvent === "Mixed Relay")
              ) {
                return relayPlayers.map((p) => ({
                  name: p.name,
                  dept: p.branch,
                  sem: p.semester,
                  contact: teamLeaderContact, // Use team leader contact for relay players
                }));
              }

              // Single-player entries: only team leader
              if (isSinglePlayerEntry) {
                return [
                  {
                    name: teamLeaderName,
                    dept: branch,
                    sem: semester,
                    contact: teamLeaderContact,
                  },
                ];
              }

              // Team events: Player 1 (Team Leader) + additional players (Player 2 onwards)
              return [
                {
                  name: teamLeaderName,
                  dept: branch,
                  sem: semester,
                  contact: teamLeaderContact,
                },
                ...players.map((p) => ({
                  name: p.name,
                  dept: p.branch,
                  sem: p.semester,
                  contact: teamLeaderContact, // All players use team leader contact
                })),
              ];
            };

            const playersPayload = buildPlayersPayload();

            const payload = {
              sport, // normalized lowercase
              category: phpCategory, // normalized lowercase
              players: playersPayload, // [{ name, dept, sem }]
              dept: branch, // as selected
              sem: semester, // as selected (e.g. "5K")
              group,
              noOfPlayers: effectiveNumberOfPlayers || numberOfPlayers,
              contact: teamLeaderContact,
              altContact: alternateContact,
              order_id: order.order_id,
              payment_id: response.razorpay_payment_id,
              payment_signature: response.razorpay_signature,
              teamLeaderEmail,
            };

            console.log("FINAL_PAYLOAD_SENT_TO_BACKEND", payload);

            const res = await fetch(
              "https://apvcouncil.in/api/store-registration.php",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              }
            );

            if (!res.ok) {
              setIsSubmittingRegistration(false);
              console.error("Failed to store registration", await res.text());
              alert(
                "Payment succeeded, but failed to store registration. Please contact the organizers with your payment ID."
              );
              return;
            }

            const data = await res.json();

            if (!data.success) {
              setIsSubmittingRegistration(false);
              console.error("Backend reported failure", data);
              alert(
                "Payment succeeded, but registration failed on the server. Please contact the organizers with your payment ID."
              );
              return;
            }

            setRegistrationNumber(
              typeof data.sr_no === "number" ? data.sr_no : null
            );
            setEmailStatus(
              data.email_status === "sent" ||
                data.email_status === "failed" ||
                data.email_status === "skipped"
                ? data.email_status
                : null
            );

            setIsSubmittingRegistration(false);
            setIsSuccessModalOpen(true);
          } catch (err) {
            setIsSubmittingRegistration(false);
            console.error("Error while storing registration", err);
            alert(
              "Payment succeeded, but an error occurred while storing registration. Please contact the organizers with your payment ID."
            );
          }
        },
        theme: {
          color: "#f97316",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
      setIsLoadingPayment(false);
    } catch (error) {
      console.error("Failed to initialize payment", error);
      alert("Failed to initialize payment. Please try again.");
      setIsLoadingPayment(false);
    }
  };

  const effectiveMinPlayers = limits.min;
  const effectiveMaxPlayers = limits.max;

  // Show player counter only for per-player pricing with variable player count
  const showPlayerCounter =
    config.dynamicPlayerFields &&
    config.priceType === "perPlayer" &&
    effectiveMinPlayers !== effectiveMaxPlayers;

  const showSkeleton = isLoadingPayment || isSubmittingRegistration;

  return (
    <Layout>
      {showSkeleton && <LoadingSkeleton variant="fullPage" />}
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{event?.icon || "🏆"}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{config.title}</h1>
                  <p className="text-lg opacity-90">
                    {event?.category || "Sport"} Registration
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={handlePayment}
              className={`p-8 ${
                showSkeleton ? "opacity-0 pointer-events-none" : ""
              }`}
            >
              <RegistrationFormFields
                teamLeaderName={teamLeaderName}
                setTeamLeaderName={setTeamLeaderName}
                teamLeaderEmail={teamLeaderEmail}
                setTeamLeaderEmail={setTeamLeaderEmail}
                teamLeaderContact={teamLeaderContact}
                setTeamLeaderContact={setTeamLeaderContact}
                alternateContact={alternateContact}
                setAlternateContact={setAlternateContact}
                group={group}
                setGroup={setGroup}
                branch={branch}
                setBranch={setBranch}
                semester={semester}
                setSemester={setSemester}
                numberOfPlayers={effectiveNumberOfPlayers || 1}
                setNumberOfPlayers={
                  showPlayerCounter ? setNumberOfPlayers : () => {}
                }
                minPlayers={
                  showPlayerCounter
                    ? effectiveMinPlayers
                    : effectiveNumberOfPlayers
                }
                maxPlayers={
                  showPlayerCounter
                    ? effectiveMaxPlayers
                    : effectiveNumberOfPlayers
                }
                players={players}
                setPlayers={setPlayers}
                category={category}
                setCategory={setCategory}
                categoryOptions={config.categories}
                hidePlayerFields={isSinglePlayerEntry}
                emailError={emailError}
              />

              {/* Athletics event selection (single dropdown) */}
              {config.priceType === "athletics" && config.athleticsEvents && (
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Select Athletics Event
                  </h3>
                  <select
                    value={selectedAthleticsEvent}
                    onChange={(e) => setSelectedAthleticsEvent(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Event</option>
                    {config.athleticsEvents.map((event) => (
                      <option key={event.name} value={event.name}>
                        {event.name} - ₹{event.price}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Shot Put Sub-Category */}
              {config.requiresShotPutSubCategory &&
                selectedAthleticsEvent === "Shot Put" && (
                  <div className="bg-gray-50 p-6 rounded-lg mt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      Shot Put Category
                    </h3>
                    <select
                      value={shotPutSubCategory}
                      onChange={(e) => setShotPutSubCategory(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Select Sub-Category</option>
                      <option value="boys">Boys</option>
                      <option value="girls">Girls</option>
                    </select>
                  </div>
                )}

              {/* Relay Team Members */}
              {needsRelayPlayers && (
                <div className="bg-gray-50 p-6 rounded-lg mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Relay Team Members (4 players required)
                  </h3>
                  <div className="space-y-4">
                    {relayPlayers.map((player, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          index === 0
                            ? "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200"
                            : "bg-white border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <h4 className="font-semibold text-gray-700">
                            Team Member {index + 1}
                            {index === 0 && " (Team Leader)"}
                          </h4>
                          {index === 0 && (
                            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full font-semibold">
                              Auto-filled
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Name *
                            </label>
                            <input
                              type="text"
                              value={player.name}
                              onChange={(e) => {
                                const updated = [...relayPlayers];
                                updated[index].name = e.target.value;
                                setRelayPlayers(updated);
                              }}
                              disabled={index === 0}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                index === 0
                                  ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Branch *
                            </label>
                            <select
                              value={player.branch}
                              onChange={(e) => {
                                const updated = [...relayPlayers];
                                updated[index].branch = e.target.value;
                                setRelayPlayers(updated);
                              }}
                              disabled={index === 0}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                index === 0
                                  ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select Branch</option>
                              <option value="AN">AN</option>
                              <option value="TE">TE</option>
                              <option value="ME">ME</option>
                              <option value="AE">AE</option>
                              <option value="CE">CE</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Semester *
                            </label>
                            <select
                              value={player.semester}
                              onChange={(e) => {
                                const updated = [...relayPlayers];
                                updated[index].semester = e.target.value;
                                setRelayPlayers(updated);
                              }}
                              disabled={index === 0}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                                index === 0
                                  ? "border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select Semester</option>
                              {["1K", "2K", "3K", "4K", "5K", "6K"].map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee Summary */}
              <div className="bg-orange-50 p-6 rounded-lg border-2 border-orange-200 mt-8">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900">
                    Total Fee
                  </span>
                  <span className="text-3xl font-bold text-orange-600">
                    ₹{totalFee}
                  </span>
                </div>
              </div>

              {/* Payment Notice */}
              <div className="mt-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-yellow-800 mb-1">
                      Important Notice
                    </p>
                    <p className="text-sm text-yellow-700">
                      After completing the payment, take a screenshot of your
                      successful payment page. This screenshot will be required
                      for verification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={totalFee === 0}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay Now - ₹{totalFee}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Pre-Payment Confirmation Modal */}
      {isPrePaymentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3 text-center">
              Important Notice Before Payment
            </h2>

            <p className="text-sm text-gray-700 mb-2">
              Please take a screenshot of the payment success page after
              completing the transaction.
            </p>

            <p className="text-sm text-gray-700 mb-2">
              If you do not receive the confirmation email, kindly contact the
              organizer immediately.
            </p>

            <p className="text-xs text-gray-600 mb-4">
              <span className="font-semibold">Note:</span> No refund will be
              provided without valid proof of payment. For any issues, please
              contact the organizers at least 5 days before the event begins.
            </p>
            <p className="text-sm text-gray-800 mb-2">
              <span className="font-semibold">
                Contact:
                <br />
              </span>{" "}
              Soham Dhanokar <br />
              (OCM Head) <br /> 9321895202
            </p>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsPrePaymentOpen(false)}
                className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleStartPayment}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:scale-105 transition-all"
              >
                I Agree & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        countdown={successCountdown}
        srNo={registrationNumber}
        emailStatus={emailStatus}
      />
    </Layout>
  );
};

export default SportPageTemplate;
