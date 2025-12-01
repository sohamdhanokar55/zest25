import { useEffect, useRef, useState } from "react";

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
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-orange-600">ZEST</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-8"></div>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            ZEST, the prestigious annual sports event of Agnel Polytechnic,
            Vashi, is a dynamic celebration of athletic skill, teamwork, and
            student spirit. The event brings together participants from various
            departments, creating an atmosphere filled with energy,
            determination, and friendly competition. With a diverse lineup of
            sports such as volleyball, cricket, football, athletics, and indoor
            games, ZEST provides a platform for students to showcase their
            talent, discipline, and passion for sports. Each match is conducted
            with professionalism and fairness, reflecting the institution’s
            commitment to promoting sportsmanship and holistic development.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
            Beyond physical performance, ZEST plays a significant role in
            building character and confidence among students. It encourages
            leadership, unity, and mutual respect, as participants learn to work
            together, overcome challenges, and strive for excellence. The event
            also highlights the strong organizational capabilities of the
            student committees and staff, who ensure smooth coordination and an
            engaging experience for all. Over the years, ZEST has grown into a
            cherished tradition, symbolizing enthusiasm, perseverance, and the
            vibrant college culture of Agnel Polytechnic. It stands as a
            reminder that sports are not just games, but powerful experiences
            that inspire growth, resilience, and lifelong memories.
          </p>
          {/* <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            Join us in celebrating the essence of sportsmanship, unity, and
            excellence at ZEST 2025 – where champions are made and legends are
            born!
          </p> */}
        </div>
      </div>
    </section>
  );
};

export default About;
