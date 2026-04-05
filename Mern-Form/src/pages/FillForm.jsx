import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFormById, submitForm } from "../Services/api";

const FillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const response = await getFormById(id);
        setForm(response.data);
      } catch (_error) {
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading form...</h2>;
  }

  if (!form) {
    return <h2 style={{ padding: "20px" }}>Form not found</h2>;
  }

  const handleChange = (label, value) => {
    setAnswers((current) => ({
      ...current,
      [label]: value,
    }));
  };

  const handleSubmit = async () => {
    const missingField = form.fields.find((field) => !answers[field.label]?.trim());

    if (missingField) {
      alert(`Please fill ${missingField.label}`);
      return;
    }

    try {
      await submitForm({
        formId: form._id,
        submittedBy: localStorage.getItem("userEmail") || "user@evotech.global",
        data: answers,
      });

      alert("Submitted Successfully");
      navigate("/user");
    } catch (_error) {
      alert("Failed to submit form");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "32px 20px",
        background: "#f8fafc",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "12px" }}>{form.title}</h2>
        <p style={{ color: "#4b5563", marginTop: 0, marginBottom: "24px" }}>
          Enter your details below and submit the form.
        </p>

        {form.fields.map((field, index) => (
          <div key={index} style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
              {field.label}
            </label>
            <input
              value={answers[field.label] || ""}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.label, e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            width: "auto",
            padding: "10px 18px",
            background: "#0d6b57",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default FillForm;
