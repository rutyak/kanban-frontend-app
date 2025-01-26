import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import MenuDrawer from "../MenuDrawer/MenuDrawer";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="logo">
          <Link to="/">Kanban Board</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="mobile-nav">
          <button className="menu-button" onClick={toggleDrawer(true)}>
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className={`drawer ${drawerOpen ? "open" : ""}`}>
          <MenuDrawer
            user={user}
            toggleDrawer={toggleDrawer}
            handleLogout={handleLogout}
          />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
