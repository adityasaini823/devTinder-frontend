import React from "react";
import { useLocation } from "react-router-dom";
import api from "../axios/api";
import { useDispatch } from "react-redux";
import { removeFeed } from "../../utils/feedSlice";
import { newConnection } from "../../utils/connectionSlice";
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  // Adjust if birthday hasn't occurred this year yet
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
const ProfileCard = ({ user }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  // console.log(location);
  const { firstName, lastName, dob, gender, bio, role, profilePicture } = user;
  let age = calculateAge(dob);
  const handleIgnore = async () => {
    try {
      const response = await api.post(`/match/skip/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = response.data;
      dispatch(removeFeed(user._id));
    } catch (error) {
      console.log(error);
    }
  };
  const handleInterested = async () => {
    try {
      const response = await api.post(`/match/like/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = response.data;
      dispatch(removeFeed(user._id));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="card bg-base-300 w-96 shadow-sm">
      {location.pathname == "/profile" && (
        <div className="absolute badge badge-primary right-2.5">Preview</div>
      )}
      <figure>
        <img
          className="w-auto h-60 mt-2"
          src={
            profilePicture ||
            "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
          }
          alt="Profile Picture"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">
          {firstName.toUpperCase()} {lastName.toUpperCase()}
        </h2>
        {age && gender && (
          <p>
            {age}, {gender}
          </p>
        )}
        {role && <p>{role}</p>}
        <p>{bio}</p>
        {location.pathname !== "/profile" && (
          <div className="card-actions justify-evenly">
            <button className="btn btn-primary" onClick={handleIgnore}>
              Ignore
            </button>
            <button className="btn btn-secondary" onClick={handleInterested}>
              Interested
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
