import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../axios/api";
import { useDispatch } from "react-redux";
import { addUser } from "../../utils/userSlice";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    // bio: "",
    // location: "",
    role: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      gender,
      dob,
      role,
    } = formData;

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await api.post(
        "/signup",
        {
          firstName,
          lastName,
          username,
          email,
          password,
          confirmPassword,
          dob,
          gender,
          role,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data;
      console.log(data); // Debug API response

      setSuccess("Signup successful! Redirecting to profile...");
      dispatch(addUser(data.user));

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      } else {
        console.warn("No accessToken in response — check backend!");
      }

      // Use navigate instead of window.location.href
      navigate("/profile");
    } catch (error) {
      console.log(error.response); // Debug API error
      setError(
        error.response?.data?.errors ||
          error.response?.data?.error ||
          "Something went wrong!"
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg bg-base-300 shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create an Account
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="input input-bordered w-full"
          />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="input input-bordered w-full"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="input input-bordered w-full"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input input-bordered w-full"
          />
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Select Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
          {/* <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
            className="textarea textarea-bordered w-full"
          /> */}
          {/* <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="input input-bordered w-full"
          /> */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button onClick={handleSignup} className="btn btn-primary w-full mt-4">
          Sign Up
        </button>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
