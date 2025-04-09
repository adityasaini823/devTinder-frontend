import React from "react";
import api from "../axios/api";

import { useNavigate } from "react-router-dom";
const ConnectionCard = ({ friend }) => {
  const navigate = useNavigate();
  return (
    <li
      className="list-row"
      onClick={() => {
        navigate("/chat/" + friend._id, {
          state: { receiver: friend },
        });
      }}
    >
      <div>
        <img className="size-10 rounded-box" src={friend.profilePicture} />
      </div>
      <div>
        <div>
          {friend.firstName.toUpperCase()} {friend.lastName.toUpperCase()}
        </div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {friend.role}
        </div>
      </div>
    </li>
  );
};

export default ConnectionCard;
