import React, { useEffect } from "react";
import { useState } from "react";
import ProfileCard from "./ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../utils/userSlice";
import api from "../axios/api";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);

  // State for editable fields
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [dob, setDob] = useState(
    user?.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
  );
  const [profilePicture, setProfilePicture] = useState(null);
  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);
  const [gender, setGender] = useState(user.gender || "");
  const [role, setRole] = useState(user.role);
  const [location, setLocation] = useState(user.location || "");
  const [preview, setPreview] = useState(user.profilePicture);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Update preview when Redux store changes
  useEffect(() => {
    if (currentUser?.profilePicture) {
      setPreview(currentUser.profilePicture);
    }
  }, [currentUser]);

  const data = {
    firstName: firstName,
    lastName: lastName,
    dob: dob,
    bio: bio,
    username: username,
    gender: gender,
    role: role,
    location: location,
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get selected file
    if (file) {
      setProfilePicture(file); // Update state
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpdate = async () => {
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    try {
      const response = await api.patch(
        "/user/profile/pictureUpdate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Update Redux store with new user data
      dispatch(addUser(response.data.user));

      // Update preview with the new image URL
      setPreview(response.data.user.profilePicture);

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setProfilePicture(null);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update profile picture"
      );
    }
  };

  const cancelImageUpdate = () => {
    setProfilePicture(null);
    setPreview(currentUser.profilePicture || user.profilePicture);
  };

  const updateProfile = async () => {
    try {
      const response = await api.patch("/user/updateProfile", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Update Redux store with new user data
      dispatch(addUser(response.data.user));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      setError(error?.message);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="m-2 max-w-md bg-base-300 shadow-lg rounded-2xl p-6 flex-auto">
        <div className="flex flex-col items-center ">
          {/* Profile Picture */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500">
            <img
              src={
                preview ||
                "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              }
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";
              }}
            />
          </div>
          <div className="flex justify-center items-center m-2">
            {/* File Input for Profile Picture */}
            <div>
              {!profilePicture && (
                <label className="mt-2 cursor-pointer bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 mx-1">
                  Edit Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
            {profilePicture && (
              <div className="flex justify-center items-center m-2">
                <button
                  onClick={cancelImageUpdate}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 mx-1 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImageUpdate}
                  className="bg-pink-500 text-white px-4 py-1 rounded-md hover:bg-pink-600 mx-1 cursor-pointer"
                >
                  Update
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {/* First Name */}
          <div className="flex items-center">
            <div className="mx-1 ">
              <label className="block text-gray-600 text-sm mb-1">
                First Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="mx-1">
              <label className="block text-gray-600 text-sm mb-1">
                Last Name
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          {/* Email (Disabled) */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              className="input w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={user.email}
              disabled
            />
          </div>
          {/* Username */}
          <div>
            <label className="block text-gray-600 text-sm mb-1">Username</label>
            <input
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            {/* Date of Birth */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            {/* Gender */}
            <div>
              <label className="block text-gray-600 text-sm mb-1">Gender</label>
              <select
                defaultValue={gender || "Choose option"}
                className="select w-full"
                onChange={(e) => setGender(e.target.value)}
              >
                <option disabled={true}>Choose option</option>
                <option>Male</option>
                <option>Female</option>
                <option>Others</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* Location */}
            <div className="mx-1">
              <label className="block text-gray-600 text-sm mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mx-1">
              <label className="block text-gray-600 text-sm mb-1">Role</label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Bio</label>
            <textarea
              type="text"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>
          <p>{error}</p>
          {/* Save Button */}
          <button
            onClick={updateProfile}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="flex-auto m-2">
        <ProfileCard
          user={{
            firstName,
            lastName,
            dob,
            gender,
            role,
            bio,
            profilePicture: preview,
          }}
        />
      </div>
      {showToast && (
        <div className="toast toast-end ">
          <div className="alert alert-success">
            <span>Profile updated successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
