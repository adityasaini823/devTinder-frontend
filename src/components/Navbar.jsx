import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../../utils/userSlice";
import api from "../axios/api";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem("accessToken");

      // Clear Redux store
      dispatch(removeUser());

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, we should still log the user out locally
      localStorage.removeItem("accessToken");
      dispatch(removeUser());
      navigate("/login");
    }
  };

  return (
    <div className="navbar bg-base-300 shadow-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          DevTinder 🌐
        </Link>
      </div>
      {user && (
        <div className="flex gap-2 ">
          <div className="flex item-center">
            Hello, {user.firstName.toUpperCase()}
          </div>
          <div className="dropdown dropdown-end mx-5">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Profile Picture"
                  src={
                    user.profilePicture &&
                    user.profilePicture.startsWith("http")
                      ? user.profilePicture
                      : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  }
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";
                  }}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/Connections" className="justify-between">
                  Connections
                </Link>
              </li>
              <li>
                <Link to="/requests" className="justify-between">
                  Requests
                </Link>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
