import { useState, useContext } from "react";
import { DarkContext } from "../Mode/DarkContext";
import axios from "axios";
import { FaLocationDot } from "react-icons/fa6";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const ContactUs = () => {
  const { darkMode } = useContext(DarkContext);

  // Form state
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

  // Dynamic styling based on dark mode
  const bgColor = darkMode ? "bg-gray-900" : "bg-gray-100";
  const cardBg = darkMode ? "bg-gray-800" : "bg-white";
  const textColor = darkMode ? "text-gray-100" : "text-gray-800";
  const inputBg = darkMode ? "bg-gray-700" : "bg-gray-50";
  const inputBorder = darkMode ? "border-gray-600" : "border-gray-300";
  const inputFocus = darkMode
    ? "focus:border-purple-500"
    : "focus:border-blue-500";
  const buttonColor = "bg-blue-600 hover:bg-blue-700";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
    <div
      className={`min-h-screen w-full flex flex-col ${bgColor} ${textColor} transition-colors duration-300`}
    >
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-400 border-opacity-20">
        <h1 className="text-4xl font-bold text-center">Contact Us</h1>
        <p className="mt-2 text-lg text-center opacity-80">
          We value your feedback and suggestions
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col flex-grow p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Contact Form */}
            <div
              className={`w-full md:w-2/3 ${cardBg} rounded-2xl shadow-lg p-8 flex flex-col`}
            >
              <h2 className="mb-6 text-2xl font-bold">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                      placeholder="Your email address"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                    required
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Issue</option>
                    <option value="artist">Artist Support</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                    placeholder="Brief subject of your message"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="suggestion"
                    value={formData.suggestion}
                    onChange={handleChange}
                    rows="6"
                    className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                    placeholder="Share your thoughts, questions, or feedback..."
                    required
                  />
                </div>

                {error && (
                  <div className="p-4 text-red-700 bg-red-100 border-l-4 border-red-500 rounded">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="p-4 text-green-700 bg-green-100 border-l-4 border-green-500 rounded">
                    <p className="font-medium">Success</p>
                    <p>
                      Thank you! Your message has been submitted successfully.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 ${buttonColor} text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Send Message
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 ml-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Info Side */}
            <div className="w-full md:w-1/3">
              <div className={`${cardBg} rounded-2xl shadow-lg p-6 mb-6`}>
                <h3 className="mb-4 text-xl font-bold">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MdEmail />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="opacity-80">support@artgallery.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaPhone />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="opacity-80">+1 (123) 456-7890</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FaLocationDot />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="opacity-80">Demo Street </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${cardBg} rounded-2xl shadow-lg p-6`}>
                <h3 className="mb-4 text-xl font-bold">Support Hours</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </li>
                </ul>
                <div className="p-4 mt-4 bg-gray-500 rounded-lg bg-opacity-10">
                  <p className="text-sm">
                    well all this info is just for demo, concidering its for my
                    project :
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
