import { useState } from "react";

const ContactUs = () => {
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
      const response = await fetch(`${API_URL}/api/suggestions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

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
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit suggestion");
      }
    } catch (err) {
      setError("Failed to submit suggestion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-[#fcf8f3] text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-8 text-[#5a4634]">
          Contact Us
        </h2>

        <div className="bg-white rounded-xl shadow-md p-8 border border-[#e0e0e0]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                required
              >
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Issue</option>
                <option value="artist">Artist Support</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Suggestion *
              </label>
              <textarea
                name="suggestion"
                value={formData.suggestion}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-[#d6b28d] rounded-lg bg-[#faf4ee] text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#b88946]"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && (
              <p className="text-green-600 text-sm">
                Thank you! Your suggestion has been submitted successfully.
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b88946] to-[#d6b28d] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
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
