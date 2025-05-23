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
import Account from "./pages/Account";
import FamilyEmergencyPlan from "./pages/FamilyEmergencyPlan";
import SeedBank from "./pages/SeedBank";
import { SupplyProvider } from "./contexts/SupplyContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <SupplyProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/mission" element={<MissionPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfUse />} />
              <Route path="/water" element={<WaterStorage />} />
              <Route path="/resources" element={<TrustedResources />} />
              <Route path="/family-emergency-plan" element={<FamilyEmergencyPlan />} />
              <Route path="/seedbank" element={<SeedBank />} />
              <Route path="/" element={<Index />} />
              {/* Protected Routes */}
              <Route path="/account" element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } />
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
