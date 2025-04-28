
import { Link } from 'react-router-dom'
import './navbar.css'
import { useAuth } from "../context/AuthContext.tsx";
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'; // Import the pre-initialized auth instance
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>FireChat</h1>
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        {currentUser ? (
          <>
            <Link to="/profile" className="navbar-item">Profile</Link>
            <Link to="/messages" className="navbar-item">Messages</Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">Login</Link>
            <Link to="/register" className="navbar-item">Register</Link>

          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar;