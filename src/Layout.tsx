import { Outlet } from "react-router";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToHash from "@/components/ScrollToHash";
import { useTheme } from "@/hooks/use-theme";

export default function Layout() {
  const { dark, toggleMode } = useTheme();

  return (
    <div className="min-h-screen">
      <ScrollToHash />
      <Header dark={dark} onToggleMode={toggleMode} />
      <Outlet />
      <Contact />
      <Footer />
    </div>
  );
}
