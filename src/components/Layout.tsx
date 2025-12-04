import Navbar from "./Navbar";

import Footer from "./Footer";

import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
      <Navbar />

      <main
        className={`w-full max-w-full overflow-x-hidden ${
          isHome ? "" : "pt-28"
        }`}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
