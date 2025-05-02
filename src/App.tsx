
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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MissionPage from "./pages/MissionPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import { SupplyProvider } from "./contexts/SupplyContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { DataMigrationModal } from "./components/DataMigrationModal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SupplyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <DataMigrationModal />
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/mission" element={<MissionPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/kit" element={
                <ProtectedRoute>
                  <KitPage />
                </ProtectedRoute>
              } />
              <Route path="/food" element={
                <ProtectedRoute>
                  <FoodStorage />
                </ProtectedRoute>
              } />
              <Route path="/water" element={<WaterStorage />} />
              <Route path="/resources" element={<TrustedResources />} />
              <Route path="/report" element={
                <ProtectedRoute>
                  <PrepReport />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SupplyProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
