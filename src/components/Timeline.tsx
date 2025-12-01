import { useEffect, useRef, useState } from "react";
import {
  Calendar,
  Users,
  Trophy,
  ShoppingBag,
  FileText,
  Award,
} from "lucide-react";

const Timeline = () => {
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

  const timelineEvents = [
    {
      date: "5th December 2025",
      title: "Team Formation Starts",
      description: "Begin forming your teams and strategizing",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      date: "12th December 2025",
      title: "Last Date to Purchase Jersey",
      description: "Final day to purchase official Zest jersey",
      icon: ShoppingBag,
      color: "from-purple-500 to-purple-600",
    },
    {
      date: "15th December 2025",
      title: "Last Date to Register for Zest",
      description: "Final day for event registrations",
      icon: Calendar,
      color: "from-orange-500 to-red-600",
    },
    {
      date: "20th December 2025",
      title: "Day 1 Inaugration & Events",
      description: "Inauguration ceremony and Day 1 events commence",
      icon: Trophy,
      color: "from-green-500 to-green-600",
    },
    {
      date: "22nd December 2025",
      title: "Day 2 Events",
      description: "Second day of thrilling sports action",
      icon: Award,
      color: "from-cyan-500 to-cyan-600",
    },
    {
      date: "23rd December 2025",
      title: "Day 3 Events & Prize Distribution",
      description: "Final day of events and prize distribution ceremony",
      icon: Trophy,
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Event <span className="text-orange-500">Timeline</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-orange-500 to-red-600"></div>

            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <div
                  key={index}
                  className={`relative mb-12 transition-all duration-700 delay-${
                    index * 200
                  } ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-10"
                  }`}
                >
                  <div
                    className={`md:flex items-center ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    <div className="md:w-5/12">
                      <div
                        className={`bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow ${
                          index % 2 === 0 ? "md:text-right" : "md:text-left"
                        }`}
                      >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-orange-600 font-semibold mb-2">
                          {event.date}
                        </p>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>

                    <div className="hidden md:flex md:w-2/12 justify-center">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center shadow-lg`}
                      >
                        <Icon className="text-white" size={28} />
                      </div>
                    </div>

                    <div className="md:w-5/12"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;
