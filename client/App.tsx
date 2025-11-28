import "./global.css";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AboutUs from "./pages/about_us";
import Blog from "./pages/blog";
import Contact from "./pages/contact";
import Community from "./pages/community";
import PeerAdvocates from "./pages/PeerAdvocates";
import MythsVsFacts from "./pages/Mythsvsfacts";
import DebugCloudinary from "./pages/DebugCloudinary";
import PeerAdvocateSignup from "./pages/peer-advocate-signup";
import PeerAdvocateLogin from "./pages/peer-advocate-login";
import PeerAdvocateDashboard from "./pages/peer-advocate-dashboard";
import Dashboard from "./components/dashboard";
import Login from "./components/dashboard/Login";
import Signup from "./components/dashboard/Signup";
import { getOrCreateAnonId } from "./lib/anon";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GetHelpPage from "./pages/get_help";

// Lazy-load clinic testing page (uses Leaflet)
const ClinicTesting = lazy(() => import("./pages/clinic_testing"));

const queryClient = new QueryClient();

const App = () => {
  // Initialize anonymous user ID on app start
  useEffect(() => {
    getOrCreateAnonId();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Student Auth Routes (using new JWT system) */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Peer Advocate Routes (using old auth system) */}
              <Route path="/peer-advocate-signup" element={<PeerAdvocateSignup />} />
              <Route path="/peer-advocate-login" element={<PeerAdvocateLogin />} />
              <Route path="/peer-advocate-dashboard" element={<PeerAdvocateDashboard />} />

              {/* Routes WITH Layout (navbar and footer) */}
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/about" element={<Layout><AboutUs /></Layout>} />
              <Route path="/blog" element={<Layout><Blog /></Layout>} />
              <Route path="/community" element={<Layout><Community /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/get-help" element={<Layout><GetHelpPage /></Layout>} />
              <Route path="/clinic-testing" element={<Layout><Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}><ClinicTesting /></Suspense></Layout>} />
              <Route path="/peer-advocates" element={<Layout><PeerAdvocates /></Layout>} />
              <Route path="/myths-vs-facts" element={<Layout><MythsVsFacts /></Layout>} />
              <Route path="/debug/cloudinary" element={<Layout><DebugCloudinary /></Layout>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
