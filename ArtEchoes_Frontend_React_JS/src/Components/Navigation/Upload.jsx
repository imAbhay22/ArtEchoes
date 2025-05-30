import { useState, useContext, useRef } from "react";
import { useAppContext } from "../AppContext";
import { IoMdArrowDropdown } from "react-icons/io";
import { DarkContext } from "../Mode/DarkContext";
import axios from "axios";

const categoryOptions = [
  "Auto",
  "painting",
  "drawing",
  "oil painting",
  "watercolor",
  "acrylic painting",
  "sketch",
  "digital art",
  "sculpture",
  "photography",
  "mixed media",
  "collage",
  "abstract art",
  "impressionism",
  "pop art",
  "minimalism",
  "conceptual art",
  "printmaking",
  "portrait painting",
  "landscape painting",
  "modern art",
  "street art",
  "realism",
  "surrealism",
];

const UploadArt = () => {
  const { fetchArtworks } = useAppContext();
  const { darkMode } = useContext(DarkContext);

  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Auto");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const fileInputRef = useRef(null);

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
  const secondaryButtonColor = darkMode
    ? "bg-gray-700 hover:bg-gray-600"
    : "bg-gray-200 hover:bg-gray-300";
  const tagBg = darkMode
    ? "bg-indigo-900 text-indigo-300"
    : "bg-indigo-100 text-indigo-800";
  const tagClose = darkMode
    ? "text-indigo-300 hover:text-indigo-100"
    : "text-indigo-600 hover:text-indigo-900";

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

  const handlePriceChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setPrice(value);
  };

  const removeTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSelectedCategory("Auto");
    setDescription("");
    setPrice("");
    setTags([]);
    setFile(null);
    setImagePreview(null);
    setError("");
    setSuccess("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

    const userId = localStorage.getItem("userId");
    const artistName = localStorage.getItem("username") || "Unknown Artist";

    if (!userId) {
      setError("User not authenticated. Please log in.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("categories", JSON.stringify([selectedCategory]));
    formData.append("description", description);
    formData.append("price", price);
    formData.append("tags", JSON.stringify(tags));
    formData.append("artwork", file);
    formData.append("userId", userId);
    formData.append("artist", artistName);

    try {
      const response = await axios.post(
        `${API_BASE}/api/upload/classify`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const result = response.data;

      // Show categorized info
      const categorizedAs = result.artwork?.categorizedAs || selectedCategory;
      const artworkPrice = result.artwork?.price;

      setSuccess(
        `Artwork uploaded successfully! ${
          selectedCategory === "Auto" ? `Categorized as "${categorizedAs}"` : ""
        }, priced at ₹${artworkPrice}`
      );

      await fetchArtworks(); // Fetch the updated artworks list after upload

      // Clear form fields after successful upload
      resetForm();
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      console.error("Upload Error:", error);
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
        <h1 className="text-4xl font-bold text-center">Upload Your Artwork</h1>
        <p className="mt-2 text-lg text-center opacity-80">
          Share your creations with the world
        </p>
      </header>

      {/* Main Content */}
      <div className="flex flex-col flex-grow gap-8 p-4 md:flex-row md:p-8">
        {/* Form Side */}
        <div className="flex flex-col w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-lg font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                  placeholder="Enter artwork title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    className={`w-full px-4 py-3 text-left rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition flex justify-between items-center`}
                  >
                    <span>{selectedCategory || "Select a category"}</span>
                    <IoMdArrowDropdown className="w-5 h-5" />
                  </button>

                  {showOptions && (
                    <div
                      className={`absolute z-10 w-full mt-2 border rounded-md shadow-md max-h-60 overflow-y-auto ${
                        darkMode ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="grid grid-cols-2 gap-1 p-2">
                        {categoryOptions.map((cat) => (
                          <div
                            key={cat}
                            className={`p-2 cursor-pointer rounded-md text-sm ${
                              darkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-100"
                            }`}
                            onClick={() => {
                              setSelectedCategory(cat);
                              setShowOptions(false);
                            }}
                          >
                            {cat}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={handleDescriptionChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                  placeholder="Add description with #hashtags..."
                />

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-2 py-1 text-sm rounded ${tagBg}`}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className={`ml-1 ${tagClose}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={handlePriceChange}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                  placeholder="Enter price in ₹"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">
                  Upload File <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <label
                    className={`px-6 py-3 ${buttonColor} text-white rounded-lg cursor-pointer hover:opacity-90 transition flex items-center justify-center`}
                  >
                    <span className="mr-2">Choose File</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="file"
                      accept="image/*, .pdf, .psd, .ai"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      required
                    />
                  </label>
                  <span className="w-full truncate sm:w-auto">
                    {file?.name || "No file chosen"}
                  </span>
                </div>
                <p className="text-sm italic opacity-70">
                  Supported formats: JPEG, PNG, PDF, PSD, AI (Max 20MB)
                </p>
              </div>
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
                <p>{success}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-4 ${buttonColor} text-white font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center`}
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
                    Uploading...
                  </>
                ) : (
                  <>
                    Upload Art
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={`px-6 py-4 ${secondaryButtonColor} rounded-lg hover:opacity-90 transition`}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Preview Side */}
        <div className="w-full mt-8 md:w-1/2 md:mt-0">
          <div
            className={`h-full ${cardBg} rounded-2xl shadow-lg p-6 flex flex-col`}
          >
            <h2 className="mb-4 text-2xl font-bold">Preview</h2>

            <div className="flex flex-col items-center justify-center flex-grow p-6 mb-6 border-2 border-dashed rounded-xl">
              {imagePreview ? (
                <div className="relative w-full text-center">
                  <img
                    src={imagePreview}
                    alt="Artwork preview"
                    className="object-contain mx-auto rounded-lg max-h-64"
                  />
                  <div className="mt-4">
                    <p className="text-xl font-bold">
                      {title || "Untitled Artwork"}
                    </p>
                    {selectedCategory !== "Auto" && (
                      <p className="mt-1 text-sm opacity-80">
                        {selectedCategory}
                      </p>
                    )}
                    {price && <p className="mt-1 text-lg">₹{price}</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-16 h-16 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-lg">
                    Upload an image to preview your artwork
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-500 rounded-lg bg-opacity-10">
              <h3 className="mb-2 font-medium">Upload Tips</h3>
              <ul className="pl-5 space-y-2 text-sm list-disc opacity-80">
                <li>
                  Use high-quality images to showcase your artwork clearly
                </li>
                <li>
                  Add relevant hashtags in the description for better
                  discoverability
                </li>
                <li>
                  Set fair pricing based on materials, size, and complexity
                </li>
                <li>Choose the most specific category for your artwork</li>
                <li>
                  Add a detailed description to help potential buyers understand
                  your piece
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadArt;
