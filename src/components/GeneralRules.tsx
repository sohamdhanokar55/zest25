import { useEffect, useRef, useState } from "react";
import { CheckCircle } from "lucide-react";

const GeneralRules = () => {
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

  const rules = [
    "Wearing the official jersey is mandatory for every event.",
    "Participants must carry their college ID for verification.",
    "All players must report 15 minutes before their event or risk disqualification.",
    "Only registered players are allowed to participate.",
    "All players must show respect to officials, opponents, and teammates.",
    "The umpire or referee's decision is final and cannot be argued.",
    "Abusive, disrespectful, or unacceptable behavior leads to immediate disqualification.",
    "Players must bring their own equipments which are approved by the umpire or referee.",
    "No unsafe play, pushing, or physical misconduct is allowed.",
    "Any injury must be reported to officials immediately.",
    "Unauthorized players entering the field will result in penalties or disqualification.",
    "No tampering with equipment, court markings, or match setup.",
    "Players must cooperate with official photography and videography during the event.",
  ];

  return (
    <section
      id="general-rules"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            General Rules & <span className="text-orange-500">Guidelines</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Please read and adhere to these essential rules and guidelines for
            all events
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {rules.map((rule, index) => (
                <div
                  key={index}
                  className={`flex gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:border-orange-500/30 transition-all duration-300 delay-${
                    index * 50
                  } ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    <CheckCircle className="text-orange-500" size={20} />
                  </div>
                  <p className="text-gray-200 text-sm md:text-base leading-relaxed">
                    {rule}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className={`mt-12 p-8 bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-500/30 rounded-xl transition-all duration-700 delay-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <p className="text-gray-200 text-center text-lg">
              <span className="font-semibold text-orange-400">Important:</span>{" "}
              Non-compliance with these rules may result in disqualification
              from the event or suspension from future ZEST events.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneralRules;
