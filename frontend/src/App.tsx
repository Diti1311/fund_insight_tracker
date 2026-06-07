import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Watchlist } from './pages/Watchlist';
import { FundDetail } from './pages/FundDetail';
import { Login } from './pages/Login';
import { Register } from "./pages/Register";
// Protected Route wrapper
function ProtectedRoute({ children }: {children: React.ReactNode;}) {
  const { user, isLoading } = useAuth();
  if (isLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
function AppRoutes() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/fund/:id" element={<FundDetail />} />
        <Route
          path="/watchlist"
          element={
          <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          } />
        
      </Route>
    </Routes>);

}
export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>);

}