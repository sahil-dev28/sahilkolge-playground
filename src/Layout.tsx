import { Outlet, useLocation } from "react-router";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToHash from "@/components/ScrollToHash";
import { useTheme } from "@/hooks/use-theme";

export default function Layout() {
  const { dark, toggleMode } = useTheme();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen">
      <ScrollToHash />
      <Header dark={dark} onToggleMode={toggleMode} />
      <Outlet />
      {/* The agent view's markdown already carries the email. */}
      {pathname !== "/agent" && <Contact />}
      <Footer />
    </div>
  );
}
