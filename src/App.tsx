import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Campagnes from "./pages/Campagnes";
import ContentKalender from "./pages/ContentKalender";
import Producten from "./pages/Producten";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Instellingen from "./pages/Instellingen";
import Berichten from "./pages/Berichten";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/campagnes" element={<Campagnes />} />
            <Route path="/content-kalender" element={<ContentKalender />} />
            <Route path="/producten" element={<Producten />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/instellingen" element={<Instellingen />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
