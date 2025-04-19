import React, { useState, useContext, useRef } from "react";
import { useAppContext } from "../AppContext";
import axios from "axios";
import { DarkContext } from "../Mode/DarkContext";

const Upload3DArt = () => {
  const { fetchArtworks } = useAppContext();
  const { darkMode } = useContext(DarkContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const thumbnailInputRef = useRef(null);
  const modelInputRef = useRef(null);

  const API_BASE =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "http://192.168.1.100:5000";

  const handleThumbnailChange = (e) => {
    if (e.target.files[0]) {
      setThumbnail(e.target.files[0]);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleModelChange = (e) => {
    if (e.target.files[0]) setModelFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title || !thumbnail || !modelFile) {
      setError("Title, thumbnail and 3D model file are required");
      return;
    }
    setLoading(true);
    const userId = localStorage.getItem("userId");
    const artistName = localStorage.getItem("username") || "Unknown Artist";
    if (!userId) {
      setError("Please log in to upload.");
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("thumbnail", thumbnail);
    formData.append("modelFile", modelFile);
    formData.append("category", "3d-art");
    formData.append("userId", userId);
    formData.append("artist", artistName);

    try {
      await axios.post(`${API_BASE}/api/upload/3d-art`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("3D art uploaded successfully!");
      await fetchArtworks();
      setTitle("");
      setDescription("");
      setPrice("");
      setThumbnail(null);
      setModelFile(null);
      setThumbnailPreview(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setThumbnail(null);
    setModelFile(null);
    setThumbnailPreview(null);
    setError("");
    setSuccess("");
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    if (modelInputRef.current) modelInputRef.current.value = "";
  };

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

  return (
    <div
      className={`min-h-screen w-full flex flex-col ${bgColor} ${textColor} transition-colors duration-300`}
    >
      {/* Header */}
      <header className="px-8 py-6 border-b border-gray-400 border-opacity-20">
        <h1 className="text-4xl font-bold text-center">
          Upload Your 3D Artwork
        </h1>
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
                <label className="text-lg font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                  placeholder="Describe your artwork..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">Price (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg ${inputBg} ${inputBorder} border ${inputFocus} focus:outline-none transition`}
                  placeholder="Set your price (optional)"
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">
                  Thumbnail Image <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <label
                    className={`px-6 py-3 ${buttonColor} text-white rounded-lg cursor-pointer hover:opacity-90 transition flex items-center justify-center`}
                  >
                    <span className="mr-2">Choose Image</span>
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
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                      ref={thumbnailInputRef}
                      required
                    />
                  </label>
                  <span className="w-full truncate sm:w-auto">
                    {thumbnail?.name || "No file chosen"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium">
                  3D Model File <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col items-center gap-4 sm:flex-row">
                  <label
                    className={`px-6 py-3 ${buttonColor} text-white rounded-lg cursor-pointer hover:opacity-90 transition flex items-center justify-center`}
                  >
                    <span className="mr-2">Choose Model</span>
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <input
                      type="file"
                      accept=".obj,.fbx,.glb,.gltf"
                      className="hidden"
                      onChange={handleModelChange}
                      ref={modelInputRef}
                      required
                    />
                  </label>
                  <span className="w-full truncate sm:w-auto">
                    {modelFile?.name || "No file chosen"}
                  </span>
                </div>
                <p className="text-sm italic opacity-70">
                  Supported formats: .obj, .fbx, .glb, .gltf
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
                    Upload 3D Art
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
              {thumbnailPreview ? (
                <div className="relative w-full">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    className="object-contain mx-auto rounded-lg max-h-64"
                  />
                  <div className="mt-4 text-center">
                    <p className="text-xl font-bold">
                      {title || "Untitled Artwork"}
                    </p>
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
                    Upload a thumbnail to preview your artwork
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-500 rounded-lg bg-opacity-10">
              <h3 className="mb-2 font-medium">Upload Tips</h3>
              <ul className="pl-5 space-y-2 text-sm list-disc opacity-80">
                <li>Use high-quality thumbnails to attract more viewers</li>
                <li>Detailed descriptions improve discoverability</li>
                <li>Optimize your 3D models for better loading times</li>
                <li>Set fair pricing based on complexity and quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload3DArt;
