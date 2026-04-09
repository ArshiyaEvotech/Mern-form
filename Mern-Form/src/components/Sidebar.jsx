import { Link } from "react-router-dom";
import "../App.css";

const Sidebar = ({ role }) => {
  const isAdmin = role === "admin";

  return (
    <div className="sidebar">
      <h2>{isAdmin ? "Admin Panel" : "User Panel"}</h2>
      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <Link to="/admin/create">Forms</Link>
            <Link to="/admin/review">Review</Link>
          </>
        ) : (
          <Link to="/user">Interview Page</Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
