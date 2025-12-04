import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  MessageCircle,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-28 h-28 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              <img src="/zest/council.png" alt="Council Logo"></img>
            </div>
            <div className="w-24 h-24 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              <img src="/zest/agnel.png" alt="Agnel Logo"></img>
            </div>
          </div>

          <p className="text-center text-gray-300 mb-6 max-w-2xl">
            Organized by APV Council in association with Agnel Polytechnic,
            Vashi
          </p>

          <div className="flex gap-6 mb-6">
            {/* <a
              href="#"
              className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              <Facebook size={24} />
            </a> */}
            <a
              href="https://www.instagram.com/apv_council/"
              target="_blank"
              className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              <Instagram size={24} />
            </a>
            <a
              href="https://www.linkedin.com/company/agnel-polytechnic-vashi-council"
              target="_blank"
              className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="https://www.youtube.com/@APVMEDIA0423"
              target="_blank"
              className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              <Youtube size={24} />
            </a>
            <a
              href="https://whatsapp.com/channel/0029VbBPi7KJkK7FaH6VwS3S"
              target="_blank"
              className="bg-white/10 p-3 rounded-full hover:bg-orange-500 transition-colors"
            >
              <MessageCircle size={24} />
            </a>
          </div>

          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400">
              &copy; 2025 ZEST - Agnel Polytechnic, Vashi. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
