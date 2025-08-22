import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Courses from "./pages/admin/Courses";
import Webinars from "./pages/admin/Webinars";
import Slider from "./pages/admin/Slider";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import Popup from "./components/Popup";

const queryClient = new QueryClient();

const App = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds when the website loads
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Dashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/courses"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Courses />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/webinars"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Webinars />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/slider"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Slider />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          
          {/* Popup Component */}
          <Popup isOpen={showPopup} onClose={() => setShowPopup(false)} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
