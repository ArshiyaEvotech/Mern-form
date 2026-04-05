import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { deleteAllForms, getForms } from "../Services/api";
import "../App.css";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadForms = async () => {
      try {
        const response = await getForms();
        setForms(response.data);
      } catch (_error) {
        setForms([]);
      }
    };

    loadForms();
  }, []);

  const handleClearAll = async () => {
    try {
      await deleteAllForms();
      setForms([]);
      alert("All forms and responses deleted successfully");
    } catch (_error) {
      alert("Failed to delete forms");
    }
  };

  return (
    <div style={{ display: "flex", background: "transparent", minHeight: "100vh" }}>
      <Sidebar role="admin" />
                                             
      <div style={{ marginLeft: "240px", width: "100%", minHeight: "100vh" }}>
        <Header title="Admin Panel" />

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
                fontSize: "20px",
                fontWeight: 500,
                fontStyle: "normal",
                lineHeight: 1.15,
                color: "#111827",
              }}
            >
              Review Forms
            </h2>

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
