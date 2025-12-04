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

  const isHome = location.pathname === "/";
  const navBackgroundClass = isHome
    ? isScrolled
      ? "bg-white shadow-lg py-2"
      : "bg-transparent py-4"
    : "bg-white shadow-lg py-2";

  const linkTextClass = isHome
    ? isScrolled
      ? "text-gray-800"
      : "text-white"
    : "text-gray-800";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${navBackgroundClass}`}
    >
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="w-full max-w-full px-4">
          <div className="flex items-center justify-between gap-2 md:gap-4 min-h-[80px] w-full max-w-full">
            <div className="flex items-center gap-2 md:gap-4 min-w-0 overflow-hidden">
              <button
                onClick={handleHomeClick}
                className="cursor-pointer flex-shrink-0"
              >
                <div className="w-20 md:w-28 h-20 md:h-28 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-sm md:text-xl flex-shrink-0">
                  <img
                    src="/zest/council.png"
                    alt="Council Logo"
                    className="w-16 md:w-24 h-16 md:h-24"
                  ></img>
                </div>
              </button>
              <button
                onClick={handleHomeClick}
                className="cursor-pointer flex-shrink-0"
              >
                <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-sm md:text-xl flex-shrink-0">
                  <img
                    src="/zest/agnel.png"
                    alt="Agnel Logo"
                    className="w-14 md:w-20 h-14 md:h-20"
                  ></img>
                </div>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-8 flex-1 min-w-0 overflow-hidden">
              <button
                onClick={handleHomeClick}
                className={`font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${linkTextClass}`}
              >
                Home
              </button>
              {navLinks.slice(1).map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`font-medium transition-colors hover:text-orange-600 whitespace-nowrap ${linkTextClass}`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <button
              className="md:hidden flex-shrink-0 p-2 max-w-[40px] max-h-[40px] overflow-hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className={`${linkTextClass} w-6 h-6 flex-shrink-0`} />
              ) : (
                <Menu className={`${linkTextClass} w-6 h-6 flex-shrink-0`} />
              )}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="md:hidden mt-2 mb-4 bg-white rounded-lg shadow-lg overflow-x-hidden w-full max-w-full">
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
      </div>
    </nav>
  );
};

export default Navbar;
