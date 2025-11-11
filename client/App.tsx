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
import GetHelp from "./pages/get_help";
import Blog from "./pages/blog";
import Contact from "./pages/contact";
import Community from "./pages/community";
import PeerAdvocates from "./pages/PeerAdvocates";
import MythsVsFacts from "./pages/Mythsvsfacts";
import DebugCloudinary from "./pages/DebugCloudinary";
import { getOrCreateAnonId } from "./lib/anon";

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
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/get-help" element={<GetHelp />} />
              <Route path="/peer-advocates" element={<PeerAdvocates />} />
              <Route path="/myths-vs-facts" element={<MythsVsFacts />} />
              <Route path="/debug/cloudinary" element={<DebugCloudinary />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
