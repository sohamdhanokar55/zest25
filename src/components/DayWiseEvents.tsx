import { useEffect, useRef, useState } from 'react';

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
      day: 'Day 1',
      date: '22nd December',
      events: [
        { name: 'Football', icon: '⚽', color: 'from-green-400 to-green-600' },
        { name: 'Kabaddi', icon: '🤼', color: 'from-orange-400 to-red-600' },
        { name: 'Basketball', icon: '🏀', color: 'from-orange-500 to-orange-700' }
      ]
    },
    {
      day: 'Day 2',
      date: '23rd December',
      events: [
        { name: 'Badminton', icon: '🏸', color: 'from-blue-400 to-blue-600' },
        { name: 'Volleyball', icon: '🏐', color: 'from-purple-400 to-purple-600' },
        { name: 'Cricket', icon: '🏏', color: 'from-red-400 to-red-600' }
      ]
    }
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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {days.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`transition-all duration-700 delay-${dayIndex * 200} ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white">
                  <h3 className="text-3xl font-bold mb-1">{day.day}</h3>
                  <p className="text-lg opacity-90">{day.date}</p>
                </div>
                <div className="p-6 space-y-4">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${event.color} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        {event.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
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
