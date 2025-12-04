import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const JerseyDesigns = () => {
  const navigate = useNavigate();
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

  const jerseyDesigns = [
    {
      name: "Electronics&Computer",
      image: "/zest/jersey_design/Electronics & Computer.png",
      department: "TE",
    },
    {
      name: "Mechanical",
      image: "/zest/jersey_design/Mechanical.png",
      department: "ME",
    },
    {
      name: "Civil",
      image: "/zest/jersey_design/Civil.png",
      department: "CE",
    },

    {
      name: "Automobile",
      image: "/zest/jersey_design/Automobile.png",
      department: "AE",
    },
    {
      name: "Artificial Intelligence",
      image: "/zest/jersey_design/Artificial Intelligence.png",
      department: "AN",
    },
  ];

  return (
    <section
      id="jersey-designs"
      ref={sectionRef}
      className="py-20 bg-slate-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Official Zest <span className="text-amber-400">Jersey Designs</span>
          </h2>
          <div className="w-24 h-1 bg-amber-400 mx-auto mb-4"></div>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-6">
            Show your department pride with our official Zest jerseys.
            <br /> <span className="text-amber-400">Note:</span> Jersey is
            mandatory for participation in all events.
          </p>
          <button
            onClick={() => navigate("/jersey")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-all duration-300"
          >
            Purchase Jersey
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {jerseyDesigns.map((jersey, index) => (
            <div
              key={index}
              className={`transition-all duration-700 delay-${index * 100} ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <button
                onClick={() => navigate("/jersey")}
                className="w-full h-full bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-amber-400 transition-all duration-300 group cursor-pointer"
              >
                <div className="relative overflow-hidden bg-slate-700 aspect-[3/4]">
                  <img
                    src={jersey.image}
                    alt={`${jersey.name} Jersey`}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4 text-center border-t border-slate-700">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {jersey.name}
                  </h3>
                  <p className="text-sm text-amber-400 font-medium">
                    {jersey.department}
                  </p>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JerseyDesigns;
