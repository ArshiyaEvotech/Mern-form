import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getApiErrorMessage, getForms } from "../Services/api";

const UserDashboard = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const response = await getForms();
        setForms(response.data);
        setError("");
      } catch (error) {
        setForms([]);
        setError(getApiErrorMessage(error, "Failed to load forms"));
      }
    };

    loadForms();
  }, []);

  return (
    <div style={{ display: "flex", background: "transparent", minHeight: "100vh" }}>
      <Sidebar role="user" />

      <div style={{ marginLeft: "220px", width: "100%", minHeight: "100vh" }}>
        <Header title="Interview Page" />

        <div style={{ padding: "28px" }}>
          <div
            style={{
              maxWidth: "760px",
              background: "transparent",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "22px 24px",
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: "14px",
                fontSize: "22px",
                fontWeight: 800,
                fontStyle: "normal",
                lineHeight: 1.15,
                color: "#111827",
              }}
            >
              Interview Forms
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "15px",
                fontWeight: 600,
              
                lineHeight: 1.4,
                color: "#374151",
              }}
            >
            Click any form to enter your details and submit it.
            </p>

            {error && (
              <p style={{ marginTop: 0, marginBottom: "18px", color: "#b91c1c" }}>
                {error}
              </p>
            )}

            {forms.length === 0 && <p style={{ margin: 0 }}>No interview forms available right now.</p>}

            {forms.length > 0 && (
              <ol style={{ paddingLeft: "26px", margin: 0 }}>
                {forms.map((form) => (
                  <li
                    key={form._id}
                    style={{
                      marginBottom: "10px",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontStyle: "normal",
                      lineHeight: 1.25,
                      color: "#111827",
                    }}
                  >
                    <button
                      className="interview-form-button"
                      type="button"
                      onClick={() => navigate(`/form/${form._id}`)}
                      style={{
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        padding: 0,
                        margin: 0,
                        width: "auto",
                        cursor: "pointer",
                        color: "inherit",
                        fontFamily: "inherit",
                        fontSize: "inherit",
                        fontWeight: "inherit",
                        fontStyle: "inherit",
                        lineHeight: "inherit",
                        textAlign: "left",
                        userSelect: "none",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {form.title}
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
