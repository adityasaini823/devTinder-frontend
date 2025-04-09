import React from "react";
import RequestCard from "./RequestCard";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../../utils/requestSlice";
import { useEffect } from "react";
import api from "../axios/api";
import { newConnection } from "../../utils/connectionSlice";
const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);

  const allRequests = async () => {
    try {
      const response = await api.get("/match/requests", {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      const data = response.data;
      //   console.log(JSON.stringify(data.requests));
      dispatch(addRequests(data.requests));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!requests || requests.length === 0) {
      allRequests();
    }
  }, [requests]);
  // ✅ Accept request function
  const acceptRequest = async (requestId, sender) => {
    try {
      const response = await api.post(
        `/match/accept/${requestId}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("accessToken") },
        }
      );
      if (response.data.success) {
        dispatch(removeRequest(requestId));
        dispatch(newConnection(sender));
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // ❌ Reject request function
  const rejectRequest = async (requestId) => {
    try {
      const response = await api.post(
        `/match/reject/${requestId}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("accessToken") },
        }
      );
      if (response.data.success) {
        dispatch(removeRequest(requestId)); // Remove request from Redux state
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };
  return (
    <div className="flex justify-around items-center ">
      <div className="card card-border bg-base-300 w-100">
        <div className="card-body">
          <h2 className="card-title">Requests</h2>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">
              All Pending Requests
            </li> */}
            {requests?.length > 0 ? (
              requests.map(({ request_id, sender }) => (
                <RequestCard
                  key={request_id}
                  requestId={request_id} // ✅ Pass request ID
                  sender={sender} // ✅ Pass sender details
                  onAccept={() => acceptRequest(request_id, sender)} // ✅ Use request ID for API
                  onReject={() => rejectRequest(request_id)} // ✅ Use request ID for API
                />
              ))
            ) : (
              <p>No requests found</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Requests;
