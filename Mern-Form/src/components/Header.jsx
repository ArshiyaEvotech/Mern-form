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
    <div style={headerStyle}>
      <h3 style={titleStyle}>{title}</h3>

      <div ref={menuRef} style={profileWrapperStyle}>
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          style={avatarButtonStyle}
          aria-label="Open profile menu"
        >
          <svg viewBox="0 0 64 64" style={avatarIconStyle} aria-hidden="true">
            <rect x="0" y="0" width="64" height="64" rx="12" fill="#e5e7eb" />
            <circle cx="32" cy="24" r="11" fill="#9ca3af" />
            <path
              d="M16 50c2.8-8.4 10-13 16-13s13.2 4.6 16 13"
              fill="#9ca3af"
            />
          </svg>
        </button>

        {menuOpen && (
          <div style={menuStyle}>
            <div style={emailStyle}>{email}</div>
            <button type="button" onClick={handleLogout} style={signOutButtonStyle}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;

const headerStyle = {
  height: "72px",
  background: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px",
  borderBottom: "1px solid #e5e7eb",
  boxSizing: "border-box",
};

const titleStyle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: 600,
  color: "#111827",
};

const profileWrapperStyle = {
  position: "relative",
};

const avatarButtonStyle = {
  width: "40px",
  height: "40px",
  padding: 0,
  margin: 0,
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#f9fafb",
  cursor: "pointer",
};

const avatarIconStyle = {
  width: "100%",
  height: "100%",
  display: "block",
  borderRadius: "12px",
};

const menuStyle = {
  position: "absolute",
  top: "52px",
  right: 0,
  minWidth: "220px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
  padding: "14px",
  zIndex: 10,
};

const emailStyle = {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "12px",
  wordBreak: "break-word",
  fontFamily: '"Segoe UI", Arial, sans-serif',
};

const signOutButtonStyle = {
  width: "100%",
  marginTop: 0,
  padding: "10px 12px",
  background: "#067762",
  color: "#f9f3f3",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
};
