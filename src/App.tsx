
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import KitPage from "./pages/KitPage";
import FoodStorage from "./pages/FoodStorage";
import WaterStorage from "./pages/WaterStorage";
import TrustedResources from "./pages/TrustedResources";
import NotFound from "./pages/NotFound";
import PrepReport from "./pages/PrepReport";
import { SupplyProvider } from "./contexts/SupplyContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SupplyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/kit" element={<KitPage />} />
            <Route path="/food" element={<FoodStorage />} />
            <Route path="/water" element={<WaterStorage />} />
            <Route path="/resources" element={<TrustedResources />} />
            <Route path="/report" element={<PrepReport />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SupplyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
