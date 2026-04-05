import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const Review = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("forms")) || [];
    setForms(data);
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar role="admin" />

      <div style={{ marginLeft: "240px", padding: "20px", width: "100%" }}>
        <h2>Review Forms 📊</h2>

        {forms.length === 0 && <p>No forms available</p>}

        {forms.map((form) => (
          <div
            key={form.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
            }}
          >
            <h3>{form.title}</h3>
            <p>Type: {form.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;
