import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { getApiErrorMessage, getForms } from "../Services/api";
import "../App.css";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const response = await getForms();
        setForms(response.data);
        setError("");
        setSuccess("");
      } catch (error) {
        setForms([]);
        setError(getApiErrorMessage(error, "Failed to load forms"));
        setSuccess("");
      }
    };

    loadForms();
  }, []);

  return (
    <div className="app-shell">
      <Sidebar role="admin" />
                                             
      <div className="app-main">
        <Header title="Admin Panel" />

        <div className="page-section">
          <div
            className="content-card"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            <h2
              style={{
                margin: 0,
                marginBottom: "14px",
                fontSize: "20px",
                fontWeight: 500,
                fontStyle: "normal",
                lineHeight: 1.15,
                color: "#111827",
              }}
            >
              Review Forms
            </h2>

            {error && (
              <p style={{ marginTop: 0, marginBottom: "14px", color: "#b91c1c" }}>
                {error}
              </p>
            )}

            {success && (
              <p style={{ marginTop: 0, marginBottom: "14px", color: "#047857" }}>
                {success}
              </p>
            )}

            {forms.length === 0 && <p style={{ margin: 0 }}>No forms created yet</p>}
            {forms.length > 0 && (
                <ol style={{ paddingLeft: "26px", margin: 0 }}>
                {forms.map((form) => (
                  <li
                    key={form._id}
                    style={{
                      marginBottom: "8px",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontStyle: "normal",
                      lineHeight: 1.25,
                      color: "#111827",
                    }}
                  >
                    <button
                      className="review-form-button"
                      type="button"
                      onClick={() => navigate(`/admin/submissions/${form._id}`)}
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

export default FormsList;
