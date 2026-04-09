import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { createForm, getApiErrorMessage } from "../Services/api";
import "../App.css";

const FormBuilder = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("survey");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontFamily: '"Segoe UI", Arial, sans-serif',
  };

  const btnStyle = {
    padding: "10px 20px",
    background: "#026856",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontFamily: '"Segoe UI", Arial, sans-serif',
  };

  const surveyFields = [
    { label: "Full Name", placeholder: "Enter your full name" },
    { label: "Email", placeholder: "Enter your email address" },
    { label: "Phone Number", placeholder: "Enter your phone number" },
    { label: "Service Used", placeholder: "Which service did you use?" },
    { label: "Feedback", placeholder: "Write your feedback here..." },
  ];

  const interviewFields = [
    { label: "Full Name", placeholder: "Enter your full name" },
    { label: "Email", placeholder: "Enter your email address" },
    { label: "Phone", placeholder: "Enter your phone number" },
    { label: "Position Applied", placeholder: "Enter job role" },
    { label: "Experience", placeholder: "Enter years of experience" },
    { label: "Skills", placeholder: "List your skills" },
    { label: "Why should we hire you?", placeholder: "Write your answer" },
  ];

  const fields = type === "survey" ? surveyFields : interviewFields;

  const handleCreate = async () => {
    if (!title) {
      setSuccess("");
      setError("Please enter form title.");
      return;
    }

    const newForm = {
      title,
      type,
      fields,
    };

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");
      await createForm(newForm);
      setSuccess("Form created successfully.");
      setTitle("");
      setType("survey");
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to create form");
      setError(message);
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar role="admin" />

      <div className="app-main">
        <Header title="Admin Panel" />

        <div className="page-section">
          <h2>Create Form</h2>

          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}

          <input
            style={inputStyle}
            placeholder="Enter Form Title"
            value={title}
            disabled={isSubmitting}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            style={inputStyle}
            value={type}
            disabled={isSubmitting}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="survey">Survey Form</option>
            <option value="interview">Interview Form</option>
          </select>

          <h3>Preview</h3>

          {fields.map((field, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <label>{field.label}</label>
              <input style={inputStyle} placeholder={field.placeholder} disabled />
            </div>
          ))}

          <div className="action-row">
            <button
              className="action-button"
              style={btnStyle}
              onClick={handleCreate}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Form"}
            </button>

            <button
              className="action-button"
              style={{ ...btnStyle, background: "gray" }}
              disabled={isSubmitting}
              onClick={() => {
                setTitle("");
                setType("survey");
                setError("");
                setSuccess("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;
