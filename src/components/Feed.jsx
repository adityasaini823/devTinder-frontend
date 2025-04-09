import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed } from "../../utils/feedSlice";
import ProfileCard from "./ProfileCard";
import api from "../axios/api";
const Feed = () => {
  const feed = useSelector((state) => state.feed) || [];
  // console.log(feed);
  const dispatch = useDispatch();
  const getFeed = async () => {
    try {
      const response = await api.get("/match", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = response.data.users;
      // console.log(data);
      // setUsers(data);
      dispatch(setFeed(data));
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getFeed();
  }, []);
  if (feed.length === 0) {
    return <div className="text-center">No more users to show</div>;
  }
  return (
    feed && (
      <div className="flex justify-evenly ">
        {/* {feed.map((item) => ( */}
        <ProfileCard user={feed[0]} />
        {/* ))} */}
      </div>
    )
  );
};

export default Feed;
