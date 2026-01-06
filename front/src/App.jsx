import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import Analyzer from "./pages/Analyzer";  
import History from "./pages/History";
import AuthForm from "./AuthForm";
import Demo from './pages/Demo';
import "./App.css";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  return user ? children : <Navigate to="/auth" replace />;
}

function AppContent() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/50">
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/dashboard" element={<ProtectedRoute><Analyzer /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/history/:sessionId" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;