import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TeamProvider } from "./contexts/TeamContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Automations from "./pages/Automations";
import Contacten from "./pages/Contacten";
import Broadcasts from "./pages/Broadcasts";
import ContentKalender from "./pages/ContentKalender";
import Groepschat from "./pages/Groepschat";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Instellingen from "./pages/Instellingen";
import Berichten from "./pages/Berichten";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <TeamProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/berichten" element={<Berichten />} />
              <Route path="/contacten" element={<Contacten />} />
              <Route path="/broadcasts" element={<Broadcasts />} />
              <Route path="/content-kalender" element={<ContentKalender />} />
              <Route path="/groepschat" element={<Groepschat />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/team" element={<Team />} />
              <Route path="/instellingen" element={<Instellingen />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TeamProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
