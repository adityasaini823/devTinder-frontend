import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../../utils/userSlice";
import { useNavigate } from "react-router-dom";
import api from "../axios/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    try {
      const response = await api.post(
        "/login",
        { username, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = response.data;
      dispatch(addUser(data.data.user));
      localStorage.setItem("accessToken", data.data.accessToken);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="card card-side bg-base-300 shadow-sm justify-center">
        <figure>
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            alt="Movie"
          />
        </figure>
        <div className="card-body">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Username</legend>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
              placeholder="Username/Email"
            />
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Password"
            />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </fieldset>
          <div className="card-actions  flex-col justify-center items-center  mt-4">
            <button
              className="btn btn-primary "
              onClick={() => {
                handleLogin();
              }}
            >
              Log In
            </button>
            <p className="text-center mt-4 text-sm">
              Don't have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign-In
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
