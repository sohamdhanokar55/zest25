import { useEffect, useRef, useState } from "react";

const DayWiseEvents = () => {
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

  const days = [
    {
      day: "Day 1",
      date: "20th December 2025 (Saturday)",
      events: [
        {
          name: "Inauguration Ceremony",
          icon: "🎉",
          color: "from-purple-400 to-purple-600",
        },
        { name: "Cricket", icon: "🏏", color: "from-red-400 to-red-600" },
        { name: "Futsal", icon: "⚽", color: "from-green-400 to-green-600" },
        {
          name: "Table Tennis",
          icon: "🏓",
          color: "from-blue-400 to-blue-600",
        },
        { name: "Carrom", icon: "🎯", color: "from-yellow-400 to-yellow-600" },
        { name: "Chess", icon: "♟️", color: "from-gray-400 to-gray-600" },
        { name: "Valorant", icon: "🎯", color: "from-pink-400 to-pink-600" },
        { name: "BGMI", icon: "🎮", color: "from-indigo-400 to-indigo-600" },
      ],
    },
    {
      day: "Day 2",
      date: "22nd December 2025 (Monday)",
      events: [
        { name: "Football", icon: "⚽", color: "from-green-400 to-green-600" },
        {
          name: "Box Cricket",
          icon: "🏏",
          color: "from-orange-400 to-orange-600",
        },
        { name: "Kabaddi", icon: "🤼", color: "from-orange-500 to-red-600" },
        { name: "Badminton", icon: "🏸", color: "from-blue-400 to-blue-600" },
      ],
    },
    {
      day: "Day 3",
      date: "23rd December 2025 (Tuesday)",
      events: [
        { name: "Athletics", icon: "🏃", color: "from-cyan-400 to-cyan-600" },
        {
          name: "Volleyball",
          icon: "🏐",
          color: "from-purple-400 to-purple-600",
        },
        {
          name: "Basketball",
          icon: "🏀",
          color: "from-orange-500 to-orange-700",
        },
        { name: "Tug of War", icon: "💪", color: "from-red-500 to-red-700" },
        {
          name: "Prize Distribution",
          icon: "🏆",
          color: "from-yellow-500 to-yellow-700",
        },
      ],
    },
  ];

  return (
    <section
      id="events"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Day-Wise <span className="text-orange-600">Events</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`transition-all duration-700 delay-${dayIndex * 200} ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">
                    {day.day}
                  </h3>
                  <p className="text-sm md:text-lg opacity-90">{day.date}</p>
                </div>
                <div className="p-6 space-y-3">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all cursor-pointer border border-transparent hover:border-orange-200"
                    >
                      <div
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-2xl md:text-3xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        {event.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {event.name}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DayWiseEvents;
