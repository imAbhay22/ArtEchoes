import { useState } from "react";
import { useAppContext } from "../AppContext";
import { IoMdArrowDropdown } from "react-icons/io";

const categoryOptions = [
  "Auto",
  "Painting",
  "Sculpture",
  "Digital Art",
  "Photography",
  "Drawing",
  "Mixed Media",
  "Printmaking",
];

const UploadArt = () => {
  const { fetchArtworks } = useAppContext();
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // Only one category
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://192.168.1.100:5000";

  const extractHashtags = (text) => {
    const hashtags = text.match(/#\w+/g) || [];
    return [...new Set(hashtags.map((tag) => tag.slice(1)))];
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    setDescription(text);
    setTags(extractHashtags(text));
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Auto classification function: called only when selected category is "Auto"
  const autoCategorize = async (file) => {
    const autoApiUrl = `${API_BASE}/api/upload/classify`;
    const autoFormData = new FormData();
    autoFormData.append("artwork", file);

    try {
      const response = await fetch(autoApiUrl, {
        method: "POST",
        body: autoFormData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Auto classification failed");
      }
      return result.category;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!title || !selectedCategory || !file) {
      setError("Title, a category, and file are required");
      setLoading(false);
      return;
    }

    let finalCategory = selectedCategory;
    // Only call auto classification if "Auto" is selected.
    if (selectedCategory === "Auto") {
      try {
        const autoCategory = await autoCategorize(file);
        finalCategory = autoCategory;
      } catch (err) {
        setLoading(false);
        return;
      }
    }

    const userId = localStorage.getItem("userId");
    const artistName = localStorage.getItem("username") || "Unknown Artist";

    if (!userId) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    // Send categories as a JSON stringified array
    formData.append("categories", JSON.stringify([finalCategory]));
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("artwork", file);
    formData.append("userId", userId);
    formData.append("artist", artistName);

    try {
      const response = await fetch(`${API_BASE}/api/upload/classify`, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to upload artwork");
      }
      setSuccess("Artwork uploaded successfully!");
      await fetchArtworks();

      // Reset form
      setTitle("");
      setSelectedCategory("");
      setDescription("");
      setTags([]);
      setFile(null);
    } catch (error) {
      setError(error.message);
      console.error("Upload Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-100 via-orange-200 to-red-100">
      <main className="flex items-center justify-center p-8">
        <div className="w-[75vw] mt-2 bg-white shadow-lg p-8">
          <h1 className="mb-6 text-3xl font-bold">Upload Your Art</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full mt-1 border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            {/* Category Selector with Dropdown */}
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="flex items-center w-full p-2 bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
              >
                <span>{selectedCategory || "Select a category"}</span>
                <IoMdArrowDropdown className="w-5 h-5 ml-auto" />
              </button>
              {showOptions && (
                <div className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-md">
                  {categoryOptions.map((cat) => (
                    <div
                      key={cat}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowOptions(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="block w-full h-32 mt-1 border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                placeholder="Add description with #hashtags..."
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm text-indigo-800 bg-indigo-100"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-1 text-indigo-600 hover:text-indigo-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            {/* File Uploader */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Upload File *
              </label>
              <div className="flex items-center mt-1">
                <label className="inline-block px-4 py-2 rounded-xl bg-[#b88946] text-white cursor-pointer hover:bg-[#d6b28d]">
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*, .pdf, .psd, .ai"
                    name="file"
                    required
                  />
                </label>
                <span className="ml-2 text-sm text-gray-600">
                  {file ? file.name : "No file chosen"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Supported formats: JPEG, PNG, PDF, PSD, AI (Max 20MB)
              </p>
            </div>
            {/* Status Messages */}
            {error && (
              <div className="p-3 text-red-700 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-green-700 bg-green-100 rounded-lg">
                {success}
              </div>
            )}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#b88946] to-[#d6b28d] text-white py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {loading ? "Uploading..." : "Upload Art"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadArt;
