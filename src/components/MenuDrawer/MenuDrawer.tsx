import React from "react";
import { Link, useNavigate } from "react-router-dom";

interface MenuDrawerProps {
  user: any;
  toggleDrawer: (
    open: boolean
  ) => (event: React.KeyboardEvent | React.MouseEvent) => void;
  handleLogout: () => void;
}

const MenuDrawer: React.FC<MenuDrawerProps> = ({
  user,
  toggleDrawer,
  handleLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      className="menu-drawer"
    >
      <ul className="menu-list">
        <li className="menu-item">
          <Link to="/" className="menu-link">
            Home
          </Link>
        </li>

        <li className="menu-item" onClick={handleLogout}>
          Logout
        </li>
      </ul>
    </div>
  );
};

export default MenuDrawer;
