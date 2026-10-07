import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import AgentView from "./components/AgentView";
import AllProjects from "./components/AllProjects";
import "./index.css";
import Layout from "./Layout";
import Portfolio from "./Portfolio";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Portfolio />} />
          <Route path="projects" element={<AllProjects />} />
          <Route path="agent" element={<AgentView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
