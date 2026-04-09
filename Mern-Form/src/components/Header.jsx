import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ title = "Admin Panel" }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const email = localStorage.getItem("userEmail") || "No email found";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="header-bar">
      <h3 className="header-title">{title}</h3>

      <div ref={menuRef} className="profile-wrapper">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="avatar-button"
          aria-label="Open profile menu"
        >
          <svg viewBox="0 0 64 64" className="avatar-icon" aria-hidden="true">
            <rect x="0" y="0" width="64" height="64" rx="12" fill="#e5e7eb" />
            <circle cx="32" cy="24" r="11" fill="#9ca3af" />
            <path
              d="M16 50c2.8-8.4 10-13 16-13s13.2 4.6 16 13"
              fill="#9ca3af"
            />
          </svg>
        </button>

        {menuOpen && (
          <div className="profile-menu">
            <div className="profile-email">{email}</div>
            <button type="button" onClick={handleLogout} className="signout-button">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
