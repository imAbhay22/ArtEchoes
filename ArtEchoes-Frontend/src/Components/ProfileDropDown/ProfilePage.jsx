import { useState, useEffect, useRef } from "react";
import { useAuth } from "../AuthContext";
import axios from "axios";
import defaultImg from "../../assets/FeaturedArtist/pakf.jpg";

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

  // Fetch user profile from backend using userId from AuthContext
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`/api/profile/${user.id}`)
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
    if (file && user?.id) {
      const formData = new FormData();
      formData.append("profilePic", file);
      axios
        .post(`/api/profile/${user.id}/ProfileUpload`, formData)
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
    if (user?.id) {
      axios.put(`/api/profile/${user.id}`, updatedProfile).catch((error) => {
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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={previewImage || profileData.profilePic || defaultImg}
                alt="Profile"
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-purple-600 cursor-pointer"
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
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      rows="4"
                    />
                    <div className="flex justify-end mt-2 gap-3">
                      <button
                        onClick={handleBioCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleBioSave}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
                      >
                        Save
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
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
                  className="mt-4 px-5 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
                >
                  Edit Bio
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Artworks Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 ml-5">
            My Artwork Collection
          </h2>
          {(profileData.artworks || []).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {profileData.artworks.map((art, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full h-48 object-cover"
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
