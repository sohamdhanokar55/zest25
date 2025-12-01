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

  // Athletics events
  const [selectedAthleticsEvents, setSelectedAthleticsEvents] = useState<
    string[]
  >([]);

  // Relay players (for athletics)
  const needsRelayPlayers =
    config.requiresRelayPlayers &&
    selectedAthleticsEvents.some(
      (e) => e === "Relay" || e === "Mixed Relay"
    );
  const [relayPlayers, setRelayPlayers] = useState<
    Array<{ name: string; branch: string; semester: string }>
  >([]);

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

  const initialPlayerCount =
    config.fixedPlayerCount ||
    categoryPlayerCount ||
    limits.min ||
    1;

  const [numberOfPlayers, setNumberOfPlayers] = useState(initialPlayerCount);
  const [players, setPlayers] = useState<
    Array<{ name: string; branch: string; semester: string }>
  >(
    Array(initialPlayerCount)
      .fill(null)
      .map(() => ({ name: "", branch: "", semester: "" }))
  );

  // Calculate effective number of players based on config
  const effectiveNumberOfPlayers = 
    config.priceType === "categoryBased" && category ? getCategoryPlayerCount() :
    config.fixedPlayerCount || numberOfPlayers;

  // Update players when category changes (for category-based sports)
  useEffect(() => {
    if (config.priceType === "categoryBased" && category) {
      const count = getCategoryPlayerCount();
      setNumberOfPlayers(count);
      setPlayers(
        Array(count)
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
        setPlayers(
          Array(newLimits.min)
            .fill(null)
            .map(() => ({ name: "", branch: "", semester: "" }))
        );
      }
    }
  }, [category, config.categoryBasedLimits]);

  // Update relay players when relay events are selected/deselected
  useEffect(() => {
    if (needsRelayPlayers && relayPlayers.length === 0) {
      setRelayPlayers(
        Array(4)
          .fill(null)
          .map(() => ({ name: "", branch: "", semester: "" }))
      );
    } else if (!needsRelayPlayers && relayPlayers.length > 0) {
      setRelayPlayers([]);
    }
  }, [needsRelayPlayers]);

  const handleAthleticsEventsChange = (events: string[]) => {
    setSelectedAthleticsEvents(events);
  };

  // Calculate fee
  const calculateFee = (): number => {
    if (config.priceType === "athletics" && config.athleticsEvents) {
      return selectedAthleticsEvents.reduce((total, eventName) => {
        const athleticsEvent = config.athleticsEvents?.find(
          (e) => e.name === eventName
        );
        return total + (athleticsEvent?.price || 0);
      }, 0);
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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (config.priceType === "athletics" && selectedAthleticsEvents.length === 0) {
      alert("Please select at least one event");
      return;
    }

    if (
      config.requiresShotPutSubCategory &&
      selectedAthleticsEvents.includes("Shot Put") &&
      !shotPutSubCategory
    ) {
      alert("Please select Shot Put sub-category");
      return;
    }

    if (config.dynamicPlayerFields && players.length > 0) {
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

    try {
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
      if (config.priceType === "athletics" && selectedAthleticsEvents.length > 0) {
        paymentDescription += ` - ${selectedAthleticsEvents.join(", ")}`;
      }
      if (effectiveNumberOfPlayers > 0 && config.priceType !== "athletics") {
        paymentDescription += ` - ${effectiveNumberOfPlayers} player(s)`;
      }

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: config.title,
        description: paymentDescription,
        order_id: order.order_id,
        handler: (response: RazorpaySuccessResponse) => {
          alert("Payment successful! Your registration is complete.");
          console.log("Razorpay payment successful", response);
        },
        theme: {
          color: "#f97316",
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Failed to initialize payment", error);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  const effectiveMinPlayers = limits.min;
  const effectiveMaxPlayers = limits.max;
  
  // Show player counter only for per-player pricing with variable player count
  const showPlayerCounter =
    config.dynamicPlayerFields &&
    config.priceType === "perPlayer" &&
    effectiveMinPlayers !== effectiveMaxPlayers;

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-8 text-white">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{event?.icon || "🏆"}</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {config.title}
                  </h1>
                  <p className="text-lg opacity-90">
                    {event?.category || "Sport"} Registration
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handlePayment} className="p-8">
              <RegistrationFormFields
                teamLeaderName={teamLeaderName}
                setTeamLeaderName={setTeamLeaderName}
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
                setNumberOfPlayers={showPlayerCounter ? setNumberOfPlayers : () => {}}
                minPlayers={showPlayerCounter ? effectiveMinPlayers : effectiveNumberOfPlayers}
                maxPlayers={showPlayerCounter ? effectiveMaxPlayers : effectiveNumberOfPlayers}
                players={players}
                setPlayers={setPlayers}
                category={category}
                setCategory={setCategory}
                categoryOptions={config.categories}
                selectedAthleticsEvents={selectedAthleticsEvents}
                setSelectedAthleticsEvents={handleAthleticsEventsChange}
                athleticsEvents={config.athleticsEvents}
              />

              {/* Shot Put Sub-Category */}
              {config.requiresShotPutSubCategory &&
                selectedAthleticsEvents.includes("Shot Put") && (
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
                        className="bg-white p-4 rounded-lg border border-gray-200"
                      >
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Team Member {index + 1}
                        </h4>
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
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option value="">Select Branch</option>
                              <option value="AN/TE">AN/TE</option>
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
                              required
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            >
                              <option value="">Select Semester</option>
                              {["1", "2", "3", "4", "5", "6"].map((s) => (
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

              {/* Submit Button */}
              <div className="mt-8 flex gap-4">
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
    </Layout>
  );
};

export default SportPageTemplate;

