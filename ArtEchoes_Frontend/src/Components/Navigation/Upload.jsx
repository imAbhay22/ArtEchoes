import { useState } from "react";
import { useAppContext } from "../AppContext";

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
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Base API URL configuration
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

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Updated auto-classify endpoint
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

    if (!title || selectedCategories.length === 0 || !file) {
      setError("Title, at least one category, and file are required");
      setLoading(false);
      return;
    }

    let finalCategories = selectedCategories;
    if (selectedCategories.includes("Auto")) {
      try {
        const autoCategory = await autoCategorize(file);
        finalCategories = selectedCategories.filter((cat) => cat !== "Auto");
        if (!finalCategories.includes(autoCategory)) {
          finalCategories.push(autoCategory);
        }
      } catch (err) {
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categories", JSON.stringify(finalCategories));
    formData.append("description", description);
    formData.append("tags", JSON.stringify(tags));
    formData.append("artwork", file);

    try {
      // Updated main upload endpoint
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
      setSelectedCategories([]);
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
      <main className="flex justify-center items-center p-8">
        <div className="w-[75vw] mt-2 bg-white shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Upload Your Art</h1>
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
                className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Category Selector */}
            <div
              className="w-full"
              tabIndex={0}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setShowOptions(false);
                }
              }}
            >
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <div
                className="flex items-center mt-1 border-b border-gray-300 cursor-pointer focus:border-indigo-500 focus:outline-none p-2"
                onClick={() => setShowOptions((prev) => !prev)}
              >
                {selectedCategories.length > 0
                  ? selectedCategories.join(", ")
                  : "Select Categories"}
              </div>
              {showOptions && (
                <div className="mt-2 border border-gray-300 p-2">
                  {categoryOptions.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span>{cat}</span>
                    </label>
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
                className="mt-1 block w-full border-b border-gray-300 focus:border-indigo-500 focus:outline-none h-32"
                placeholder="Add description with #hashtags..."
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-800 text-sm"
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
              <div className="mt-1 flex items-center">
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
              <div className="p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-100 text-green-700 rounded-lg">
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

// when someone uploads an art i need to send something like id to the backend so that i can store the art in the database with the user id so we know who upload the art and who is the owner of the art. and using it we can show the art the user uploaded in the profile page.
