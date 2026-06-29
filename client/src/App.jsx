import React from "react";
import { Navigate, Routes, BrowserRouter, Route } from "react-router-dom";
import { useAuthStore } from "./store/authStore.js";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectBoard from "./pages/ProjectBoard.jsx";
import Navbar from "./components/Navbar.jsx";

const ProtectedRoute = ({ children }) => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return <Navigate to="/login" />;
  }
  // console.log(token);
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <div className="h-screen">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <ProtectedRoute>
                <ProjectBoard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
