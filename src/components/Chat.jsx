import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import api from "../axios/api";

const socket = io("http://16.171.249.248:3000", { withCredentials: true });

const Chat = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: receiverId } = useParams();
  const receiver = location.state?.receiver;

  const user = useSelector((state) => state.user);
  const senderId = user?._id;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!senderId || !receiverId) return;

    // Join the socket room
    socket.emit("join", senderId);

    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const conversationId = [senderId, receiverId].sort().join("_");
        const res = await api.get(`/chat/${conversationId}`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for incoming messages
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [senderId, receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const data = { sender: senderId, receiver: receiverId, message };
    socket.emit("sendMessage", data);
    const optimisticMessage = {
      _id: Date.now(), // Temporary ID
      sender: senderId,
      receiver: receiverId,
      message: message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-base-100 shadow-md">
      {/* Header */}
      <div className="bg-base-100 p-4 flex items-center shadow-sm">
        <button className="mr-2" onClick={() => navigate("/connections")}>
          ←
        </button>
        <img
          src={receiver?.profilePicture || "https://i.pravatar.cc/100"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="font-semibold">
            {/* {JSON.stringify(receiver)} */}
            {receiver?.firstName} {receiver?.lastName}
          </h3>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 bg-base-200">
        {messages.map((msg, index) => {
          const isSender = msg.sender === senderId;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              {!isSender && (
                <img
                  src={receiver?.profilePicture || "https://i.pravatar.cc/100"}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  isSender
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-base-300 text-white rounded-bl-none"
                }`}
              >
                <p>{msg.message}</p>
                <span className="text-[10px] block mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-base-100 border-t">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-4 py-2 bg-base-300 rounded-full outline-none"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="ml-2 p-2 text-blue-500 disabled:text-gray-400"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
