import React, { useEffect } from "react";
import ConnectionCard from "./ConnectionCard";
import api from "../axios/api";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../../utils/connectionSlice";
const Connections = () => {
  const dispatch = useDispatch();
  const friends = useSelector((state) => state.connection);
  //   console.log(friends);
  const allConnections = async () => {
    try {
      const response = await api.get("/match/friends", {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      const data = response.data;
      dispatch(addConnections(data.users));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!friends || friends.length === 0) {
      allConnections();
    }
  }, []);
  return (
    <div className="flex justify-around items-center ">
      <div className="card card-border bg-base-300 w-100">
        <div className="card-body">
          <h2 className="card-title">Connections</h2>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              All Pending Requests
            </li> */}
            {friends?.length > 0 ? (
              friends.map((friend) => (
                <ConnectionCard friend={friend} key={friend._id} />
              ))
            ) : (
              <p>No connections found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Connections;
