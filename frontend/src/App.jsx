import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import Predictor from "./pages/Predictor";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/colleges" element={<Colleges />} />
        <Route
          path="/colleges/:id"
          element={
            <ProtectedRoute>
              <CollegeDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/predictor" element={<Predictor />} />
        <Route
          path="*"
          element={<div className="container section">Page not found.</div>}
        />
      </Routes>
      <footer className="footer">
        <div className="container">
          © {new Date().getFullYear()} NEET College Portal · For guidance only,
          verify official data before admission.
        </div>
      </footer>
    </>
  );
}
