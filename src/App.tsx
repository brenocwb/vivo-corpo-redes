
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Pages
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import Discipulado from "./pages/Discipulado";
import AdminUsers from "./pages/Admin/Users";
import UserManagementPage from "./pages/Admin/Users/UserManagementPage";
import Planos from "./pages/Planos";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    console.log('Usuário não é admin, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Discipulador or Admin Route component
const DiscipuladorOrAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAdmin, isDiscipulador } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin && !isDiscipulador) {
    console.log('Usuário não tem permissão, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Public Route component (for login page)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    console.log('Usuário já autenticado, redirecionando para dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Auth wrapper to use auth context
const AuthWrapper = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/grupos" element={
          <ProtectedRoute>
            <Groups />
          </ProtectedRoute>
        } />
        <Route path="/discipulado" element={
          <DiscipuladorOrAdminRoute>
            <Discipulado />
          </DiscipuladorOrAdminRoute>
        } />
        <Route path="/planos" element={
          <ProtectedRoute>
            <Planos />
          </ProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/usuarios" element={
          <AdminRoute>
            <UserManagementPage />
          </AdminRoute>
        } />
        
        {/* Default routes */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Sonner />
    </AuthProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthWrapper />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
