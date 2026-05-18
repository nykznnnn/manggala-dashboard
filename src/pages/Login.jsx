import {
  useState,
} from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  useNavigate,
} from "react-router-dom";

import {
  auth,
} from "../firebase/config";

import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");
    } catch (err) {
      setError("Email atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form
        className="login-card"
        onSubmit={handleLogin}
      >
        <h1>Manggala</h1>

        <p>
          Client Management System
        </p>

        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Signing in..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}