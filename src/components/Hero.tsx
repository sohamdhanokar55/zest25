import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/zest/photos/1.webp",
    "/zest/photos/2.webp",
    "/zest/photos/3.webp",
    "/zest/photos/4.webp",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide}
              alt={`Sports event ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 animate-fade-in tracking-tight">
          ZEST
        </h1>
        <p className="text-2xl md:text-3xl lg:text-4xl text-orange-400 mb-3 font-semibold">
          Annual Sports Event 2025
        </p>
        <p className="text-xl md:text-2xl lg:text-3xl text-white mb-4 font-medium">
          Agnel Polytechnic, Vashi
        </p>
        <p className="text-2xl md:text-3xl lg:text-4xl text-white mb-12 font-bold tracking-wide">
          Power – Passion – Play
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => scrollToSection("register")}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Register Now
          </button>
          <button
            onClick={() => scrollToSection("events")}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            View Events
          </button>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-all z-20"
      >
        <ChevronLeft className="text-white" size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/40 transition-all z-20"
      >
        <ChevronRight className="text-white" size={32} />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-orange-500 w-8" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
