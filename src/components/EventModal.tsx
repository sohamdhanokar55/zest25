import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, MapPin, Clock, DollarSign, Users, Calendar } from "lucide-react";
import { Event } from "../types/Event";
import { SPORT_ROUTES } from "../utils/sportConfig";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const EventModal = ({ event, isOpen, onClose }: EventModalProps) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handlePayNow = () => {
    const route = SPORT_ROUTES[event.id];
    if (route) {
      navigate(route);
      onClose();
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
                {event.rules.map((rule, index) => {
                  const isJerseyRule = rule.includes("Jersey is mandatory");
                  return (
                    <li
                      key={index}
                      className={`flex items-start gap-3 ${
                        isJerseyRule
                          ? "bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500"
                          : ""
                      }`}
                    >
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                          isJerseyRule
                            ? "bg-gradient-to-br from-yellow-500 to-orange-600 text-white"
                            : "bg-gradient-to-br from-orange-500 to-red-600 text-white"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span
                        className={`leading-relaxed ${
                          isJerseyRule
                            ? "text-orange-800 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {rule}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Registration Button Sidebar */}
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-gray-200 bg-gray-50 p-6 overflow-y-auto">
            <div className="sticky top-0">
              <div className="flex items-center gap-2 mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Register Now
                </h3>
              </div>

              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 mb-4">
                    Click below to proceed to registration and payment.
                  </p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>• Fill out the registration form</p>
                    <p>• Review your details</p>
                    <p>• Complete payment securely</p>
                  </div>
                </div>

                {/* Pay Now Button */}
                <button
                  onClick={handlePayNow}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold text-lg rounded-lg transition-all hover:shadow-xl hover:scale-105"
                >
                  Register & Pay Now
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
