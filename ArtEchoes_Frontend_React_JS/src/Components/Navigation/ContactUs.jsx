import { useState } from "react";
import { useContext } from "react";
import axios from "axios";
import { DarkContext } from "../Mode/DarkContext";

const ContactUs = () => {
  const { darkMode } = useContext(DarkContext);
  const modeClass = darkMode ? "dark-mode" : "light-mode";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    suggestion: "",
    category: "general",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.post(`${API_URL}/api/suggestions`, formData);

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          suggestion: "",
          category: "general",
        });
      } else {
        setError("Failed to submit suggestion");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit suggestion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className={`px-4 py-16 xl:py-6 ${modeClass} ${
        darkMode
          ? "bg-gradient-to-b from-[#141b2d] to-[#0e1015] text-[#f1f1f1]"
          : "bg-gradient-to-b from-[#f4f1ee] to-[#e8e6e1] text-[#1a1a1a]"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="mb-8 font-serif text-4xl font-bold text-center ">
          Contact Us
        </h2>

        <div
          className={` rounded-xl shadow-md p-8 border border-[#e0e0e0] ${
            darkMode ? "bg-[#2d2d2d] text-white" : "bg-white text-black"
          } `}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium ">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee]  focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium ">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium ">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee]  focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                required
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="artist">Artist Support</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium ">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Your Suggestion *
              </label>
              <textarea
                name="suggestion"
                value={formData.suggestion}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee]  focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && (
              <p className="text-sm text-green-600">
                Thank you! Your suggestion has been submitted successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b88946] to-[#d6b28d] py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Send Suggestion"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
