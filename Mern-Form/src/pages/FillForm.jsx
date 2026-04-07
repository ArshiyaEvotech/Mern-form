import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorMessage, getFormById, submitForm } from "../Services/api";

const FillForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadForm = async () => {
      try {
        const response = await getFormById(id);
        setForm(response.data);
        setError("");
      } catch (error) {
        setForm(null);
        setError(getApiErrorMessage(error, "Failed to load form"));
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
    return <h2 style={{ padding: "20px" }}>{error || "Form not found"}</h2>;
  }

  const handleChange = (label, value) => {
    setAnswers((current) => ({
      ...current,
      [label]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    if (isSubmitting) {
      return;
    }

    const missingField = form.fields.find((field) => !answers[field.label]?.trim());

    if (missingField) {
      alert(`Please fill ${missingField.label}`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      await submitForm({
        formId: form._id,
        submittedBy: localStorage.getItem("userEmail") || "user@evotech.global",
        data: answers,
      });

      alert("Submitted Successfully");
      navigate("/user");
    } catch (error) {
      const message = getApiErrorMessage(error, "Failed to submit form");
      setError(message);
      alert(message);
    } finally {
      setIsSubmitting(false);
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

        {error && (
          <p style={{ color: "#b91c1c", marginTop: 0, marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {form.fields.map((field, index) => (
            <div key={index} style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: 600 }}>
                {field.label}
              </label>
              <input
                value={answers[field.label] || ""}
                placeholder={field.placeholder}
                disabled={isSubmitting}
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
            type="submit"
            disabled={isSubmitting}
            style={{
              width: "auto",
              padding: "10px 18px",
              background: "#0d6b57",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FillForm;
