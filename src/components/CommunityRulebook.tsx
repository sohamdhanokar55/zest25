import { useEffect, useRef, useState } from "react";
import { MessageCircle, FileText, Download, ExternalLink } from "lucide-react";

const CommunityRulebook = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDownloadRulebook = () => {
    const link = document.createElement("a");
    link.href = "/zest/rulebook.pdf";
    link.download = "Zest-2025-Rulebook.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDownloadSchedule = () => {
    const link = document.createElement("a");
    link.href = "/zest/schedule.pdf";
    link.download = "Zest-2025-Schedule.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const WHATSAPP_LINK = import.meta.env.VITE_WHATSAPP_LINK || "#";

  return (
    <section
      id="community-rulebook"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-700 to-gray-600"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay Connected <span className="text-orange-500">& Prepared</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join our community and download the official rulebook
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* WhatsApp Community Card */}
          <div
            className={`transition-all duration-700 delay-0 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">
                      Join WhatsApp Community
                    </h3>
                    <p className="text-green-100 text-sm mt-1">
                      Stay updated with latest announcements
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  Connect with fellow participants, get real-time updates, and
                  stay informed about all Zest 2025 events and schedules.
                </p>
                <a
                  href={"https://chat.whatsapp.com/LTyjHydxlUHBtynr1w52nO"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <MessageCircle size={20} />
                  Join Community
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Rulebook Card */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Download Rulebook</h3>
                    <p className="text-orange-100 text-sm mt-1">
                      Official rules and regulations
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  Download the complete rulebook containing all rules,
                  regulations, and guidelines for Zest 2025 events. Make sure
                  you're well-prepared!
                </p>
                <button
                  onClick={handleDownloadRulebook}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Download size={20} />
                  Download Rulebook
                </button>
              </div>
            </div>
          </div>
          {/* {Schedule card} */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 h-full">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Download Schedule</h3>
                    <p className="text-orange-100 text-sm mt-1">
                      Official Schedule of Events
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <p className="text-gray-600 mb-6">
                  Download the complete Schedule containing all timings, with
                  dates, and for Zest events.Make sure you Participate in events
                  according to the schedule!
                </p>
                <button
                  onClick={handleDownloadSchedule}
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <Download size={20} />
                  Download Rulebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityRulebook;
