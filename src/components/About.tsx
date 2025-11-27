import { useEffect, useRef, useState } from 'react';

const About = () => {
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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <div
          className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-orange-600">ZEST</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            ZEST is the annual sports extravaganza of Agnel Polytechnic, Vashi,
            where passion meets competition and spirit meets sportsmanship. This
            two-day celebration of athletic excellence brings together students from
            various departments to compete, collaborate, and create unforgettable memories.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            From traditional sports like football and cricket to modern e-sports
            competitions, ZEST offers a platform for every athlete to shine. It's not
            just about winning; it's about the journey, the teamwork, and the indomitable
            spirit of youth that makes every moment count.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Join us in celebrating the essence of sportsmanship, unity, and excellence
            at ZEST 2025 – where champions are made and legends are born!
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
