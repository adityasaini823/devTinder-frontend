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

  // Filter requests by type
  const receivedRequests =
    requests?.filter((request) => request?.type === "received") || [];
  const sentRequests =
    requests?.filter((request) => request?.type === "sent") || [];

  const allRequests = async () => {
    try {
      const response = await api.get("/match/requests", {
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      });
      const data = response.data;

      // Ensure we have valid data before combining
      const receivedRequests = Array.isArray(data.receivedRequests)
        ? data.receivedRequests
        : [];
      const sentRequests = Array.isArray(data.sentRequests)
        ? data.sentRequests
        : [];

      // Combine and filter out any invalid requests
      const allRequests = [...receivedRequests, ...sentRequests].filter(
        (request) =>
          request &&
          request.request_id &&
          ((request.type === "received" && request.sender) ||
            (request.type === "sent" && request.receiver))
      );

      dispatch(addRequests(allRequests));
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  useEffect(() => {
    if (!requests || requests.length === 0) {
      allRequests();
    }
  }, [requests]);

  // ✅ Accept request function
  const acceptRequest = async (requestId, sender) => {
    if (!requestId || !sender) return;

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
    if (!requestId) return;

    try {
      const response = await api.post(
        `/match/reject/${requestId}`,
        {},
        {
          headers: { Authorization: localStorage.getItem("accessToken") },
        }
      );
      if (response.data.success) {
        dispatch(removeRequest(requestId));
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Received Requests Panel */}
      <div className="card card-border bg-base-300 flex-1">
        <div className="card-body">
          <h2 className="card-title text-primary">Received Requests</h2>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => {
                if (!request || !request.request_id) return null;

                return (
                  <RequestCard
                    key={request.request_id}
                    requestId={request.request_id}
                    user={request.sender}
                    type="received"
                    onAccept={() =>
                      acceptRequest(request.request_id, request.sender)
                    }
                    onReject={() => rejectRequest(request.request_id)}
                  />
                );
              })
            ) : (
              <p className="text-center py-4 text-gray-500">
                No received requests
              </p>
            )}
          </ul>
        </div>
      </div>

      {/* Sent Requests Panel */}
      <div className="card card-border bg-base-300 flex-1">
        <div className="card-body">
          <h2 className="card-title text-secondary">Sent Requests</h2>
          <ul className="list bg-base-100 rounded-box shadow-md">
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => {
                if (!request || !request.request_id) return null;

                return (
                  <RequestCard
                    key={request.request_id}
                    requestId={request.request_id}
                    user={request.receiver}
                    type="sent"
                  />
                );
              })
            ) : (
              <p className="text-center py-4 text-gray-500">No sent requests</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Requests;
