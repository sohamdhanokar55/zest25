import { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Calendar,
  Ticket,
  Plus,
  Minus,
} from "lucide-react";
import { Event } from "../types/Event";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

// Event pricing configuration
const EVENT_PRICING_CONFIG: Record<
  string,
  {
    type: "team" | "dropdown" | "athletics" | "fixed" | "bgmi" | "valorant";
    min?: number;
    max?: number;
    fixed?: number;
    options?: { label: string; value: string; price: number }[];
    athleticsEvents?: { name: string; price: number }[];
  }
> = {
  volleyball: {
    type: "team",
    min: 6,
    max: 9,
  },
  cricket: {
    type: "team",
    min: 11,
    max: 15,
  },
  futsal: {
    type: "team",
    min: 5,
    max: 7,
  },
  football: {
    type: "team",
    min: 11,
    max: 15,
  },
  "box-cricket": {
    type: "team",
    min: 7,
    max: 9,
  },
  kabaddi: {
    type: "team",
    min: 7,
    max: 9,
  },
  "tug-of-war": {
    type: "team",
    min: 7,
    max: 9,
  },
  basketball: {
    type: "team",
    min: 5,
    max: 10,
  },
  badminton: {
    type: "dropdown",
    options: [
      { label: "Singles", value: "singles", price: 100 },
      { label: "Doubles", value: "doubles", price: 200 },
      { label: "Mixed Doubles", value: "mixed", price: 200 },
    ],
  },
  "table-tennis": {
    type: "dropdown",
    options: [
      { label: "Singles", value: "singles", price: 100 },
      { label: "Doubles", value: "doubles", price: 200 },
    ],
  },
  carrom: {
    type: "dropdown",
    options: [
      { label: "Singles", value: "singles", price: 100 },
      { label: "Doubles", value: "doubles", price: 200 },
    ],
  },
  athletics: {
    type: "athletics",
    athleticsEvents: [
      { name: "100m", price: 100 },
      { name: "200m", price: 100 },
      { name: "400m", price: 100 },
      { name: "800m", price: 100 },
      { name: "Long Jump", price: 100 },
      { name: "Shot Put", price: 100 },
      { name: "Relay", price: 400 },
      { name: "Mixed Relay", price: 400 },
    ],
  },
  chess: {
    type: "fixed",
    fixed: 100,
  },
  bgmi: {
    type: "bgmi",
    fixed: 4,
  },
  valorant: {
    type: "valorant",
    max: 4,
  },
};

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const BASE_PRICE = 100;

  // State for team sports
  const [numberOfPlayers, setNumberOfPlayers] = useState(1);

  // State for dropdown sports (badminton, table-tennis, carrom)
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // State for athletics
  const [selectedAthleticsEvents, setSelectedAthleticsEvents] = useState<
    string[]
  >([]);

  // State for valorant
  const [valorantPlayers, setValorantPlayers] = useState(1);

  // Get config - use default if event is null
  const config: {
    type: "team" | "dropdown" | "athletics" | "fixed" | "bgmi" | "valorant";
    min?: number;
    max?: number;
    fixed?: number;
    options?: { label: string; value: string; price: number }[];
    athleticsEvents?: { name: string; price: number }[];
  } = event
    ? EVENT_PRICING_CONFIG[event.id] || {
        type: "team",
        min: 1,
        max: 15,
      }
    : {
        type: "team",
        min: 1,
        max: 15,
      };

  // Initialize state based on event type
  useEffect(() => {
    if (event) {
      if (config.type === "team") {
        setNumberOfPlayers(config.min || 1);
      } else if (config.type === "dropdown") {
        setSelectedCategory(config.options?.[0]?.value || "");
      } else if (config.type === "bgmi") {
        setNumberOfPlayers(4);
      } else if (config.type === "valorant") {
        setValorantPlayers(1);
      }
    }
  }, [event, config]);

  if (!event) return null;

  // Calculate total fee based on event type
  const calculateTotalFee = (): number => {
    switch (config.type) {
      case "team":
      case "bgmi":
        return numberOfPlayers * BASE_PRICE;

      case "dropdown":
        const selectedOption = config.options?.find(
          (opt: { label: string; value: string; price: number }) =>
            opt.value === selectedCategory
        );
        return selectedOption?.price || 0;

      case "athletics":
        return selectedAthleticsEvents.reduce((total, eventName) => {
          const athleticsEvent = config.athleticsEvents?.find(
            (e: { name: string; price: number }) => e.name === eventName
          );
          return total + (athleticsEvent?.price || 0);
        }, 0);

      case "fixed":
        return config.fixed || 0;

      case "valorant":
        return valorantPlayers * BASE_PRICE;

      default:
        return 0;
    }
  };

  const totalFee = calculateTotalFee();

  const handlePayNow = () => {
    // Handle payment logic here
    let paymentDetails = "";

    switch (config.type) {
      case "team":
      case "bgmi":
        paymentDetails = `${numberOfPlayers} player(s). Total: ₹${totalFee}`;
        break;
      case "dropdown":
        paymentDetails = `${selectedCategory} category. Total: ₹${totalFee}`;
        break;
      case "athletics":
        paymentDetails = `${
          selectedAthleticsEvents.length
        } event(s): ${selectedAthleticsEvents.join(", ")}. Total: ₹${totalFee}`;
        break;
      case "fixed":
        paymentDetails = `Fixed fee. Total: ₹${totalFee}`;
        break;
      case "valorant":
        paymentDetails = `${valorantPlayers} player(s). Total: ₹${totalFee}`;
        break;
    }

    console.log(`Proceeding to payment for ${event.name}: ${paymentDetails}`);
    // You can add payment integration here
  };

  const handleIncrement = () => {
    if (config.type === "team" || config.type === "bgmi") {
      if (numberOfPlayers < (config.max || 15)) {
        setNumberOfPlayers((prev) => prev + 1);
      }
    } else if (config.type === "valorant") {
      if (valorantPlayers < (config.max || 4)) {
        setValorantPlayers((prev) => prev + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (config.type === "team" || config.type === "bgmi") {
      if (numberOfPlayers > (config.min || 1)) {
        setNumberOfPlayers((prev) => prev - 1);
      }
    } else if (config.type === "valorant") {
      if (valorantPlayers > 1) {
        setValorantPlayers((prev) => prev - 1);
      }
    }
  };

  const toggleAthleticsEvent = (eventName: string) => {
    setSelectedAthleticsEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    );
  };

  const renderTicketSelector = () => {
    switch (config.type) {
      case "team":
      case "bgmi":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Number of Players
              {config.min && config.max && (
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (Min: {config.min}, Max: {config.max})
                </span>
              )}
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={numberOfPlayers <= (config.min || 1)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                  numberOfPlayers <= (config.min || 1)
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {numberOfPlayers}
                </div>
                <div className="text-sm text-gray-500">
                  Player{numberOfPlayers !== 1 ? "s" : ""}
                </div>
              </div>
              <button
                onClick={handleIncrement}
                disabled={numberOfPlayers >= (config.max || 15)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                  numberOfPlayers >= (config.max || 15)
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        );

      case "dropdown":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900 font-medium bg-white"
            >
              {config.options?.map(
                (option: { label: string; value: string; price: number }) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - ₹{option.price}
                  </option>
                )
              )}
            </select>
          </div>
        );

      case "athletics":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Events
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {config.athleticsEvents?.map(
                (athleticsEvent: { name: string; price: number }) => (
                  <label
                    key={athleticsEvent.name}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAthleticsEvents.includes(
                        athleticsEvent.name
                      )}
                      onChange={() => toggleAthleticsEvent(athleticsEvent.name)}
                      className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {athleticsEvent.name}
                      </div>
                    </div>
                    <div className="font-semibold text-orange-600">
                      ₹{athleticsEvent.price}
                    </div>
                  </label>
                )
              )}
            </div>
            {selectedAthleticsEvents.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Select at least one event
              </p>
            )}
          </div>
        );

      case "fixed":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Entry Fee
            </label>
            <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                ₹{config.fixed}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Fixed fee per participant
              </div>
            </div>
          </div>
        );

      case "valorant":
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Number of Players
              {config.max && (
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (Max: {config.max})
                </span>
              )}
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={handleDecrement}
                disabled={valorantPlayers <= 1}
                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                  valorantPlayers <= 1
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Minus size={20} />
              </button>
              <div className="flex-1 text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {valorantPlayers}
                </div>
                <div className="text-sm text-gray-500">
                  Player{valorantPlayers !== 1 ? "s" : ""}
                </div>
              </div>
              <button
                onClick={handleIncrement}
                disabled={valorantPlayers >= (config.max || 4)}
                className={`flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-all ${
                  valorantPlayers >= (config.max || 4)
                    ? "border-gray-200 text-gray-300 cursor-not-allowed"
                    : "border-orange-500 text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderPriceBreakdown = () => {
    switch (config.type) {
      case "team":
      case "bgmi":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per Player</span>
              <span className="font-semibold text-gray-900">₹{BASE_PRICE}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Number of Players</span>
              <span className="font-semibold text-gray-900">
                {numberOfPlayers}
              </span>
            </div>
          </div>
        );

      case "dropdown":
        const selectedOption = config.options?.find(
          (opt: { label: string; value: string; price: number }) =>
            opt.value === selectedCategory
        );
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Category</span>
              <span className="font-semibold text-gray-900">
                {selectedOption?.label || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entry Fee</span>
              <span className="font-semibold text-gray-900">
                ₹{selectedOption?.price || 0}
              </span>
            </div>
          </div>
        );

      case "athletics":
        return (
          <div className="space-y-2">
            {selectedAthleticsEvents.map((eventName) => {
              const athleticsEvent = config.athleticsEvents?.find(
                (e: { name: string; price: number }) => e.name === eventName
              );
              return (
                <div
                  key={eventName}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-600">{eventName}</span>
                  <span className="font-semibold text-gray-900">
                    ₹{athleticsEvent?.price || 0}
                  </span>
                </div>
              );
            })}
            {selectedAthleticsEvents.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-2">
                No events selected
              </div>
            )}
          </div>
        );

      case "fixed":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Entry Fee</span>
              <span className="font-semibold text-gray-900">
                ₹{config.fixed}
              </span>
            </div>
          </div>
        );

      case "valorant":
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price per Player</span>
              <span className="font-semibold text-gray-900">₹{BASE_PRICE}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Number of Players</span>
              <span className="font-semibold text-gray-900">
                {valorantPlayers}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceedToPayment = () => {
    switch (config.type) {
      case "athletics":
        return selectedAthleticsEvents.length > 0;
      case "dropdown":
        return selectedCategory !== "";
      default:
        return totalFee > 0;
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <div
        className={`relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
          >
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-6xl">{event.icon}</div>
            <div>
              <h2 className="text-3xl font-bold mb-1">{event.name}</h2>
              <p className="text-lg opacity-90">{event.category}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-140px)]">
          {/* Event Details Section */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {event.day && (
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar
                    className="text-orange-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Event Day</p>
                    <p className="text-gray-700">{event.day}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <MapPin
                  className="text-orange-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-gray-900">Venue</p>
                  <p className="text-gray-700">{event.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <DollarSign
                  className="text-orange-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-gray-900">Entry Fee</p>
                  <p className="text-gray-700">{event.entryFee}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                <Clock
                  className="text-orange-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-gray-900">Reporting Time</p>
                  <p className="text-gray-700">{event.reportingTime}</p>
                </div>
              </div>
              {event.teamSize && (
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg sm:col-span-2">
                  <Users
                    className="text-orange-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Team Size</p>
                    <p className="text-gray-700">{event.teamSize}</p>
                  </div>
                </div>
              )}
              {event.duration && (
                <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg sm:col-span-2">
                  <Clock
                    className="text-orange-600 flex-shrink-0 mt-1"
                    size={20}
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Duration</p>
                    <p className="text-gray-700">{event.duration}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Rules & Regulations
              </h3>
              <ul className="space-y-3">
                {event.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 leading-relaxed">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ticket Purchase Sidebar */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <div className="sticky top-0">
              <div className="flex items-center gap-2 mb-6">
                <Ticket className="text-orange-600" size={24} />
                <h3 className="text-xl font-bold text-gray-900">
                  Purchase Tickets
                </h3>
              </div>

              <div className="space-y-6">
                {/* Ticket Selector */}
                {renderTicketSelector()}

                {/* Price Breakdown */}
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="space-y-3">
                    {renderPriceBreakdown()}
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900">
                          Total Fee
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                          ₹{totalFee}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={handlePayNow}
                  disabled={!canProceedToPayment()}
                  className={`w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-lg transition-all ${
                    canProceedToPayment()
                      ? "hover:shadow-xl hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
