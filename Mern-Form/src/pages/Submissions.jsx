import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import {
  getApiErrorMessage,
  getFormById,
  getSubmissionsByForm,
} from "../Services/api";

const Submissions = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [formResponse, submissionsResponse] = await Promise.all([
          getFormById(id),
          getSubmissionsByForm(id),
        ]);

        setForm(formResponse.data);
        setSubmissions(submissionsResponse.data);
        setError("");
      } catch (error) {
        setForm(null);
        setSubmissions([]);
        setError(getApiErrorMessage(error, "Failed to load submissions"));
      }
    };

    loadData();
  }, [id]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="admin" />

      <div style={{ marginLeft: "220px", width: "100%", minHeight: "100vh" }}>
        <Header title="Admin Panel" />

        <div style={{ padding: "20px" }}>
          <h2 style={{ marginTop: 0 }}>
            Responses for {form?.title || `Form ${id}`}
          </h2>

          {error && <p style={{ color: "#b91c1c" }}>{error}</p>}

          {submissions.length === 0 && <p>No responses submitted yet.</p>}

          {submissions.map((submission, index) => (
            <div
              key={submission.id || index}
              style={{
                border: "1px solid #d1d5db",
                borderRadius: "12px",
                padding: "16px",
                marginBottom: "14px",
                background: "#ffffff",
              }}
            >
              <p style={{ marginTop: 0 }}>
                <b>Email:</b> {submission.submittedBy || "Unknown"}
              </p>
              <p>
                <b>Submitted:</b>{" "}
                {submission.createdAt
                  ? new Date(submission.createdAt).toLocaleString()
                  : "Unknown"}
              </p>

              {Object.entries(submission.responses || {}).map(([label, value]) => (
                <p key={label} style={{ marginBottom: "8px" }}>
                  <b>{label}:</b> {value}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Submissions;
