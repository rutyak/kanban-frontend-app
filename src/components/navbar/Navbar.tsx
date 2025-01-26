import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import MenuDrawer from "../MenuDrawer/MenuDrawer";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (event.type === "keydown") {
        const keyboardEvent = event as React.KeyboardEvent;
        if (keyboardEvent.key === "Tab" || keyboardEvent.key === "Shift") {
          return;
        }
      }
      setDrawerOpen(open);
    };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    handleProfileMenuClose();
    navigate("/signin");
  };

  return (
    <nav className="navbar">
      <div className="logo">Kanban Board</div>

      <div className="desktop-nav">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/createblog" className="nav-link">
          Blog Creation
        </Link>

          <div>
            <button
              className="profile-button"
              onClick={handleProfileMenuOpen}
            >
              Profile
            </button>
            <div className={`menu ${anchorEl ? "open" : ""}`}>
              <Link to="/profile" onClick={handleProfileMenuClose}>
                Profile
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
      </div>

      <div className="mobile-nav">
        <p>Menu</p>
        <button className="menu-button" onClick={toggleDrawer(true)}>
          ☰
        </button>
        {drawerOpen && (
          <div className="drawer">
            <MenuDrawer
              user={user}
              toggleDrawer={toggleDrawer}
              handleLogout={handleLogout}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
