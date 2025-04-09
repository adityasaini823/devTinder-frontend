import React, { useEffect } from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import api from "../axios/api";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../../utils/userSlice";
import { useNavigate } from "react-router-dom";
const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const profileView = async () => {
    try {
      const response = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = response.data;
      // console.log(data.user);
      dispatch(addUser(data.user));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    profileView();
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 m-2">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
