import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminDashboard = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="admin" />

      <div style={{ marginLeft: "220px", width: "100%", minHeight: "100vh" }}>
        <Header title="Admin Panel" />

        <div style={{ padding: "24px" }}>
          <h1 style={{ marginTop: 0 }}></h1>
          <p style={{ color: "#4b5563" }}>
     
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
