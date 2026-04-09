import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  deleteForm,
  getApiErrorMessage,
  getForms,
  updateForm,
} from "../Services/api";
import "../App.css";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openMenuId, setOpenMenuId] = useState("");
  const [editingFormId, setEditingFormId] = useState("");
  const [editingTitle, setEditingTitle] = useState("");
  const [busyFormId, setBusyFormId] = useState("");
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

  const startEditing = (form) => {
    setOpenMenuId("");
    setError("");
    setSuccess("");
    setEditingFormId(form._id);
    setEditingTitle(form.title);
  };

  const handleUpdateForm = async () => {
    if (!editingTitle.trim()) {
      setSuccess("");
      setError("Please enter form title.");
      return;
    }

    try {
      setBusyFormId(editingFormId);
      setError("");
      setSuccess("");
      const response = await updateForm(editingFormId, {
        title: editingTitle,
      });

      setForms((current) =>
        current.map((form) =>
          form._id === editingFormId ? response.data : form
        )
      );
      setEditingFormId("");
      setEditingTitle("");
      setSuccess("Form updated successfully.");
    } catch (error) {
      setSuccess("");
      setError(getApiErrorMessage(error, "Failed to update form"));
    } finally {
      setBusyFormId("");
    }
  };

  const handleDeleteForm = async (formId) => {
    try {
      setBusyFormId(formId);
      setOpenMenuId("");
      setEditingFormId("");
      setEditingTitle("");
      setError("");
      setSuccess("");
      await deleteForm(formId);
      setForms((current) => current.filter((form) => form._id !== formId));
      setSuccess("Form deleted successfully.");
    } catch (error) {
      setSuccess("");
      setError(getApiErrorMessage(error, "Failed to delete form"));
    } finally {
      setBusyFormId("");
    }
  };

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
                      marginBottom: "18px",
                      fontSize: "15px",
                      fontWeight: 400,
                      fontStyle: "normal",
                      lineHeight: 1.25,
                      color: "#111827",
                    }}
                  >
                    <div className="form-row">
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

                      <div className="form-row-actions">
                        <button
                          type="button"
                          className="form-action-icon"
                          onClick={() =>
                            setOpenMenuId((current) =>
                              current === form._id ? "" : form._id
                            )
                          }
                          aria-label="Open form actions"
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path
                              d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                              fill="currentColor"
                            />
                            <path
                              d="M14.06 4.94l3.75 3.75 1.41-1.41a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.41 1.41z"
                              fill="currentColor"
                            />
                          </svg>
                        </button>

                        {openMenuId === form._id && (
                          <div className="form-action-menu">
                            <button
                              type="button"
                              className="form-action-menu-button"
                              onClick={() => startEditing(form)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="form-action-menu-button delete"
                              disabled={busyFormId === form._id}
                              onClick={() => handleDeleteForm(form._id)}
                            >
                              {busyFormId === form._id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {editingFormId === form._id && (
                      <div className="form-edit-panel">
                        <input
                          className="form-edit-input"
                          value={editingTitle}
                          disabled={busyFormId === form._id}
                          onChange={(event) => setEditingTitle(event.target.value)}
                        />
                        <div className="form-edit-actions">
                          <button
                            type="button"
                            className="form-edit-button save"
                            disabled={busyFormId === form._id}
                            onClick={handleUpdateForm}
                          >
                            {busyFormId === form._id ? "Saving..." : "Save"}
                          </button>
                          <button
                            type="button"
                            className="form-edit-button cancel"
                            disabled={busyFormId === form._id}
                            onClick={() => {
                              setEditingFormId("");
                              setEditingTitle("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
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
