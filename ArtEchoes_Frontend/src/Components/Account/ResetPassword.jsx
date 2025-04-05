import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const apiURL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://192.168.1.100:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch(`${apiURL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-black bg-gradient-to-r from-yellow-100 via-orange-200 to-red-100">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-800">
          Reset Password
        </h2>
        <p className="mb-4 text-center text-gray-500">
          Enter your new password below.
        </p>
        {message && <p className="mb-3 text-sm text-green-600">{message}</p>}
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <button
            type="submit"
            className="w-full py-2 font-bold text-white transition duration-300 bg-orange-500 rounded-lg hover:bg-orange-600"
          >
            Reset Password
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-orange-500 hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
