import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "About", id: "about" },
    { name: "Timeline", id: "timeline" },
    { name: "Events", id: "events" },
    { name: "Register", id: "register" },
    { name: "About Us", id: "about-us" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleHomeClick} className="cursor-pointer">
              <div className="w-28 h-28 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-xl">
                <img src="/zest/council.png" alt="Council Logo"></img>
              </div>
            </button>
            <button onClick={handleHomeClick} className="cursor-pointer">
              <div className="w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-xl">
                <img src="/zest/agnel.png" alt="Agnel Logo"></img>
              </div>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={handleHomeClick}
              className={`font-medium transition-colors hover:text-orange-600 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
            >
              Home
            </button>
            {navLinks.slice(1).map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`font-medium transition-colors hover:text-orange-600 ${
                  isScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-gray-800"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={isScrolled ? "text-gray-800" : "text-white"} />
            ) : (
              <Menu className={isScrolled ? "text-gray-800" : "text-white"} />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg">
            <button
              onClick={handleHomeClick}
              className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              Home
            </button>
            {navLinks.slice(1).map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-orange-50 hover:text-orange-600 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
