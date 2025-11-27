import { useEffect, useRef, useState } from "react";
import { Award, Users, Target, Sparkles } from "lucide-react";

const AboutUs = () => {
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

  // const highlights = [
  //   { icon: Award, label: 'Excellence', value: '50+ Years' },
  //   { icon: Users, label: 'Students', value: '3000+' },
  //   { icon: Target, label: 'Programs', value: '15+' },
  //   { icon: Sparkles, label: 'Events', value: '100+' }
  // ];

  return (
    <section
      id="about-us"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-white to-gray-50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            About <span className="text-orange-600">Agnel Polytechnic</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto"></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-10"
              }`}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Fr. Conceicao Rodrigues Institute of Technology, Agnel
                  Polytechnic, Vashi is a premier technical education
                  institution established in 1983. Located in the heart of Navi
                  Mumbai, our institute has been a beacon of excellence in
                  technical education for over four decades.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  With state-of-the-art infrastructure, highly qualified
                  faculty, and a commitment to holistic development, Agnel
                  Polytechnic prepares students not just for careers, but for
                  life. Our focus extends beyond academics to sports, cultural
                  activities, and personality development.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  The APV Council (Agnel Polytechnic Vashi Council) is the
                  driving force behind student activities, organizing events
                  like ZEST that foster teamwork, leadership, and the spirit of
                  healthy competition among students.
                </p>

                {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  {highlights.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={index}
                        className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow"
                      >
                        <Icon className="mx-auto text-orange-600 mb-2" size={32} />
                        <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        <p className="text-sm text-gray-600">{item.label}</p>
                      </div>
                    );
                  })}
                </div> */}
              </div>
            </div>

            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-10"
              }`}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl transform rotate-3"></div>
                <img
                  src="apv.png"
                  alt="Agnel Polytechnic Campus"
                  className="relative rounded-2xl shadow-2xl w-full h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
