import { Navigate, Route, Routes } from "react-router";
import AgentView from "./components/AgentView";
import AllProjects from "./components/AllProjects";
import CaseStudy from "./components/CaseStudy";
import Layout from "./Layout";
import Portfolio from "./Portfolio";

// Shared by the browser entry (main.tsx) and the build-time renderer (entry-server.tsx).
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Portfolio />} />
        <Route path="projects" element={<AllProjects />} />
        <Route path="agent" element={<AgentView />} />
        <Route path="work/:slug" element={<CaseStudy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
