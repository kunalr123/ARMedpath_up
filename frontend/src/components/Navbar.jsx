import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="brand">
          NEET College Portal
        </Link>
        <nav>
          <Link to="/colleges">Colleges</Link>
          <Link to="/predictor">Free Predictor</Link>
          {user ? (
            <>
              <span>Hi, {user.name.split(" ")[0]}</span>
              {user.hasFullPackage && <span className="badge">Full Access</span>}
              <button className="btn btn-outline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-accent">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
