import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../Services/api";
import "../Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail("");
    setPassword("");
    setShow(false);
    setError("");
  }, []);

  const handleLogin = async () => {
    try {
      setError("");
      const response = await loginUser({ email, password });
      const { token, user, role } = response.data;
      const resolvedUser = user || {
        email,
        role,
      };

      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", resolvedUser.email);
      localStorage.setItem("userRole", resolvedUser.role);

      navigate(resolvedUser.role === "admin" ? "/admin" : "/user");
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      setShow(false);
      setPassword("");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Sign In</h2>

        <div className="info-box">
          Login using email and password provided by your company
        </div>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-box">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="password-toggle"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow((current) => !current)}
          >
            {show ? (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 3l18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10.58 10.58a2 2 0 102.83 2.83"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M9.88 5.09A9.77 9.77 0 0112 4c5 0 9.27 3.11 11 8-1.03 2.91-3.08 5.2-5.67 6.45M6.61 6.61C4.16 7.92 2.22 10.14 1 12c.69 1.97 1.83 3.7 3.28 5.04"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            )}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Continue</button>
      </div>
    </div>
  );
};

export default Login;
