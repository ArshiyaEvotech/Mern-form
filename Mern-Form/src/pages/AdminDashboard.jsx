import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminDashboard = () => {
  return (
    <div className="app-shell">
      <Sidebar role="admin" />

      <div className="app-main">
        <Header title="Admin Panel" />

        <div className="page-section">
          <h1 style={{ marginTop: 0 }}></h1>
          <p style={{ color: "#4b5563" }}>
     
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
