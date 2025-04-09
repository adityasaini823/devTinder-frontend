import React from "react";

const RequestCard = ({ requestId, sender, onAccept, onReject }) => {
  return (
    <li className="list-row">
      <div>
        <img className="size-10 rounded-box" src={sender.profilePicture} />
      </div>
      <div>
        <div>
          {" "}
          {sender.firstName.toUpperCase()} {sender.lastName.toUpperCase()}
        </div>
        <div className="text-xs uppercase font-semibold opacity-60">
          {sender.role}
        </div>
      </div>
      <button
        className="btn btn-square btn-ghost bg-green-500"
        onClick={() => {
          onAccept(requestId, sender);
        }}
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
        onClick={() => onReject(requestId)}
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
    </li>
  );
};

export default RequestCard;
