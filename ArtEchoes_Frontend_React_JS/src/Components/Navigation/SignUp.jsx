import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setName] = useState("");
  const [error, setError] = useState("");

  // Initialize navigate function from react-router-dom
  const navigate = useNavigate();

  // Updated API URL based on your current network IP.
  const apiURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://192.168.1.100:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Generate a random internal user ID for backend management
    const userId = uuidv4();

    try {
      const response = await fetch(`${apiURL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send userId along with username, email, and password
        body: JSON.stringify({ userId, username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // Handle successful sign up (e.g., store token, redirect, etc.)
        console.log("User signed up:", data);
        // Redirect to the login page after successful sign-up
        navigate("/login");
      } else {
        setError(data.message || "Sign Up failed. Please try again.");
      }
    } catch (error) {
      console.error("Sign Up failed:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black bg-gradient-to-r from-purple-400 to-pink-400">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Join <span className="text-purple-500">ArtEchoes</span>
        </h2>
        <p className="mb-4 text-center text-gray-500">
          Sign up to showcase and explore amazing artwork.
        </p>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input (public identity) */}
          <input
            type="text"
            value={username}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {/* Email Input */}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {/* Password Input */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (6+ characters)"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 font-bold text-white transition duration-300 bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-purple-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
