import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Login = () => {
  // Renamed to 'loginInput' to reflect that it can be either an email or username.
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); // For programmatic navigation

  const apiURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://192.168.1.100:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Prepare the request body based on whether loginInput is an email or a username
    let requestBody;
    if (loginInput.includes("@")) {
      // If the input contains '@', treat it as an email.
      requestBody = { email: loginInput, password };
    } else {
      // Otherwise, treat it as a username.
      requestBody = { username: loginInput, password };
    }

    try {
      const response = await fetch(`${apiURL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (response.ok) {
        // On successful login, store the token and navigate to the home page.
        login(data.token);
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-yellow-100 via-orange-200 to-red-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Welcome Back to <span className="text-orange-500">ArtEchoes</span>
        </h2>
        <p className="text-center text-gray-500 mb-4">
          Log in to explore and share breathtaking art!
        </p>
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input field updated to reflect that it accepts email or username */}
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value)}
            placeholder="Email or Username"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-bold hover:bg-orange-600 transition duration-300"
          >
            Log In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          <Link
            to="/forgot-password"
            className="text-orange-500 font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </p>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
