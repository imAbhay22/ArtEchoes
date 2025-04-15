import { useState, useEffect, useRef, useContext } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import defaultImg from "../../assets/FeaturedArtist/pakf.jpg";
import image1 from "../../assets/Images/AboutImg.jpg";
import { DarkContext } from "../Mode/DarkContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState("");
  const [profileData, setProfileData] = useState({
    bio: "",
    profilePic: "",
    lastEdit: null,
    artworks: [],
  });
  const [previewImage, setPreviewImage] = useState("");
  const { darkMode } = useContext(DarkContext);

  // Fetch user profile (including artworks) using userId from AuthContext
  useEffect(() => {
    if (user?.userId) {
      axios
        .get(`/api/profile?userId=${user.userId}`)
        .then((res) => {
          setProfileData(res.data);
        })
        .catch((error) => {
          console.error("Error fetching profile data:", error);
        });
    }
  }, [user]);

  // Handle profile picture upload when file is selected
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && user?.userId) {
      const formData = new FormData();
      formData.append("profilePic", file);
      formData.append("userId", user.userId); // send userId with the upload
      axios
        .post("/api/profile/upload", formData)
        .then((res) => {
          setProfileData({ ...profileData, profilePic: res.data.profilePic });
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
        });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Handle bio change with a 250-word limit
  const handleBioChange = (e) => {
    const input = e.target.value;
    const words = input.trim() === "" ? [] : input.trim().split(/\s+/);
    if (words.length <= 250) {
      setEditedBio(input);
    }
  };

  // Save bio changes only
  const handleBioSave = () => {
    const updatedProfile = {
      ...profileData,
      bio: editedBio,
      lastEdit: Date.now(),
    };
    setProfileData(updatedProfile);
    setIsEditing(false);
    if (user?.userId) {
      axios
        .put("/api/profile", { ...updatedProfile, userId: user.userId })
        .then((res) => {
          // Optionally update state with response data
          setProfileData(res.data);
        })
        .catch((error) => {
          console.error("Error saving profile:", error);
        });
    }
  };

  // Cancel editing and revert any changes
  const handleBioCancel = () => {
    setIsEditing(false);
    setEditedBio(profileData.bio || "");
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container px-4 mx-auto">
        {/* Profile Header */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <img
                loading="lazy"
                src={previewImage || profileData.profilePic || defaultImg}
                alt="Profile"
                className="object-cover w-32 h-32 border-4 border-purple-600 rounded-full cursor-pointer md:w-40 md:h-40"
                onClick={() => fileInputRef.current.click()}
              />
              {/* Hidden file input for profile picture update */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800">
                {user?.username || user?.email}
              </h1>
              <div className="mt-2">
                {isEditing ? (
                  <div>
                    <textarea
                      autoFocus
                      value={editedBio || ""}
                      onChange={handleBioChange}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
                      rows="4"
                    />
                    <div className="flex justify-end gap-3 mt-2">
                      <button
                        onClick={handleBioCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBioSave}
                        className="px-4 py-2 text-white transition duration-200 bg-purple-600 rounded hover:bg-purple-700"
                      >
                        Save
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Word limit: 250. (Current:{" "}
                      {(editedBio || "").trim() === ""
                        ? 0
                        : (editedBio || "").trim().split(/\s+/).length}{" "}
                      words)
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {profileData.bio || "No bio added yet..."}
                  </p>
                )}
              </div>
              {!isEditing && (
                <button
                  onClick={() => {
                    setEditedBio(profileData.bio || "");
                    setIsEditing(true);
                  }}
                  className="px-5 py-2 mt-4 text-white transition duration-200 bg-purple-600 rounded hover:bg-purple-700"
                >
                  Edit Bio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="mt-10">
          <h2 className="mb-4 ml-5 text-2xl font-bold ">
            My Artwork Collection
          </h2>
          {(profileData.artworks || []).length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {profileData.artworks.map((art, index) => (
                <div
                  key={index}
                  className="overflow-hidden bg-white rounded-lg shadow-md"
                >
                  <img
                    loading="lazy"
                    src={
                      art.filePath
                        ? encodeURI(
                            `${
                              import.meta.env.VITE_API_URL
                            }/${art.filePath.replace(/\\/g, "/")}`
                          )
                        : image1
                    }
                    alt={art.title}
                    className="object-cover w-full h-full"
                  />

                  <div className="p-3">
                    <h3 className="text-lg font-medium text-gray-700">
                      {art.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 ml-7">No artworks uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
