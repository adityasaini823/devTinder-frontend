import React from "react";

const RequestCard = ({ requestId, user, type, onAccept, onReject }) => {
  if (!user) {
    return null;
  }

  return (
    <li className="list-row">
      <div>
        <img
          className="size-10 rounded-box object-cover"
          src={
            user.profilePicture && user.profilePicture.startsWith("http")
              ? user.profilePicture
              : "https://i.pravatar.cc/100"
          }
          alt={user.firstName || "User"}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://i.pravatar.cc/100";
          }}
        />
      </div>
      <div>
        <div>
          {(user.firstName || "").toUpperCase()}{" "}
          {(user.lastName || "").toUpperCase()}
        </div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {user.role || "Developer"}
        </div>
        <div className="text-xs text-gray-500">
          {type === "sent" ? "Request Sent" : "Request Received"}
        </div>
      </div>
      {type === "received" && (
        <>
          <button
            className="btn btn-square btn-ghost bg-green-500"
            onClick={onAccept}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-check-icon lucide-check"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </button>
          <button
            className="btn btn-square btn-ghost bg-red-500"
            onClick={onReject}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x-icon lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </>
      )}
      {type === "sent" && (
        <div className="text-sm text-gray-500 italic">
          Waiting for response...
        </div>
      )}
    </li>
  );
};

export default RequestCard;
