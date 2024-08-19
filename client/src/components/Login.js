import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ setUsername }) {
  const [isRegister, setIsRegister] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function toggleForm() {
    setIsRegister(!isRegister);
    setError(null); // Clear error on toggle
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const url = isRegister ? "/api/users/register" : "/api/users/login";
    const payload = { username: usernameInput, password };

    try {
      const response = await fetch("http://localhost:3000" + url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        if (!isRegister) {
          setUsername(usernameInput);
          localStorage.setItem("username", usernameInput);
          if (data.role === "Admin") {
            navigate("/Admin");
          } else {
            navigate("/Dashboard");
          }
        } else {
          alert("Registered successfully! You can now log in.");
          toggleForm();
        }
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="log1">
      <form onSubmit={handleSubmit}>
        <h2 id="formTitle">{isRegister ? "Register" : "Login"}</h2>
        <hr />
        <br />
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="Username"
            name="Username"
            placeholder="Enter Username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            required
          />
        </div>
        <br />
        <br />
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="Password"
            name="Password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <br />
        <button type="submit" className="btn btn-dark" id="submitButton">
          {isRegister ? "Register" : "Login"}
        </button>
        <br />
        <br />
        <span className="toggle-text" id="toggleText" onClick={toggleForm}>
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </span>
      </form>
    </div>
  );
}

export default Login;
