import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { createForm } from "../Services/api";
import "../App.css";

const FormBuilder = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("survey");

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
      alert("Please enter form title");
      return;
    }

    const newForm = {
      title,
      type,
      fields,
    };

    try {
      await createForm(newForm);
      alert("Form Created Successfully");
      setTitle("");
      setType("survey");
    } catch (_error) {
      alert("Failed to create form");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="admin" />

      <div style={{ marginLeft: "240px", width: "100%", minHeight: "100vh" }}>
        <Header title="Admin Panel" />

        <div style={{ padding: "20px" }}>
          <h2>Create Form</h2>

          <input
            style={inputStyle}
            placeholder="Enter Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <select
            style={inputStyle}
            value={type}
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

          <div style={{ marginTop: "20px" }}>
            <button style={btnStyle} onClick={handleCreate}>
              Create Form
            </button>

            <button
              style={{ ...btnStyle, background: "gray", marginLeft: "10px" }}
              onClick={() => {
                setTitle("");
                setType("survey");
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
