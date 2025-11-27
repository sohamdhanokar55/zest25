import { useEffect, useRef, useState } from 'react';
import { Event } from '../types/Event';
import { events } from '../data/events';

interface EventsGridProps {
  onEventClick: (event: Event) => void;
}

const EventsGrid = ({ onEventClick }: EventsGridProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getGradient = (index: number) => {
    const gradients = [
      'from-orange-400 to-red-600',
      'from-blue-400 to-blue-600',
      'from-green-400 to-green-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-yellow-400 to-orange-500',
      'from-teal-400 to-teal-600',
      'from-red-400 to-red-600'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section
      id="register"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Register for <span className="text-orange-500">Events</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your event and click to view complete rules, venue, and registration details
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {events.map((event, index) => (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className={`group cursor-pointer transition-all duration-500 delay-${
                (index % 8) * 50
              } ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div
                  className={`h-32 bg-gradient-to-br ${getGradient(
                    index
                  )} flex items-center justify-center text-6xl`}
                >
                  {event.icon}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{event.category}</p>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p className="font-semibold">{event.entryFee}</p>
                    {event.day && <p className="text-xs text-gray-500">{event.day}</p>}
                  </div>
                  <button className="mt-4 w-full py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsGrid;
