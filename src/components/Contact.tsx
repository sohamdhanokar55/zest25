import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";

const Contact = () => {
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

  const contacts = [
    {
      name: "Sara Pathak",
      role: "Sports Secretary",
      image: "/zest/team/Sara.webp",
      phone: "+91 8928005205",
      whatsapp: "918928005205",
    },
    {
      name: "Anshika Gupta",
      role: "Asst. Girls Representative",
      image: "/zest/team/Anshika.webp",
      phone: "+91 9004727821",
      whatsapp: "919004727821",
    },
    {
      name: "Saish Surve",
      role: "Sports Secretary",
      image: "/zest/team/Saish.webp",
      phone: "+91 8591891503",
      whatsapp: "918591891503",
    },

    {
      name: "Tristan D'souza",
      role: "Asst. Sports Secretary",
      image: "/zest/team/Tristan.webp",
      phone: "+91 7400298923",
      whatsapp: "917400298923",
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contact <span className="text-orange-500">Us</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions? Reach out to our organizing team
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {contacts.map((contact, index) => (
            <div
              key={index}
              className={`group transition-all duration-500 delay-${
                index * 100
              } ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={contact.image}
                    alt={contact.name}
                    className="w-full h-68 object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                    <a
                      href={`tel:${contact.phone}`}
                      className="bg-white/90 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
                      title="Call"
                    >
                      <Phone size={20} />
                    </a>
                    <a
                      href={`https://wa.me/${contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/90 p-2 rounded-full hover:bg-green-500 hover:text-white transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle size={20} />
                    </a>
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {contact.name}
                  </h3>
                  <p className="text-orange-600 font-semibold text-sm uppercase tracking-wide">
                    {contact.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
