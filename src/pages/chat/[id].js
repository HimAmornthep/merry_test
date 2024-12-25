import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/router";

import { NavBar } from "@/components/NavBar";
import { useAuth } from "@/contexts/AuthContext";

export default function Chat() {
  const router = useRouter();

  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);

  const { state } = useAuth();

  const { id: chatRoomId } = router.query;

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Initialize WebSocket
  useEffect(() => {
    if (!userId) return;

    const socketIo = io({ path: "/api/chat/socket" });

    socketIo.on("connect", () => {
      console.log("Connected to WebSocket:", socketIo.id);

      // Register the user ID with the server
      socketIo.emit("registerUser", userId);
    });

    socketIo.on("receiveMessage", (msg) => {
      console.log("New message received:", msg);
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [userId]);

  // Join room
  useEffect(() => {
    if (chatRoomId && socket) {
      console.log(`User: ${userId} Joining room: ${chatRoomId}`);
      socket.emit("joinRoom", chatRoomId);
    }
  }, [chatRoomId, socket]);

  // Fetch chat room id and old messages
  useEffect(() => {
    const fetchChatRoom = async () => {
      try {
        if (!chatRoomId) return;

        // Set userId for ui check
        setUserId(state.user?.id);

        // Fetch old messages
        const messagesResponse = await axios.get(
          `${apiBaseUrl}/api/chat/chatHistory/${chatRoomId}`,
        );
        if (messagesResponse.data?.messages) {
          setMessages(messagesResponse.data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch user or chat room details:", error);
      }
    };

    fetchChatRoom();
  }, [chatRoomId]);

  const messageType = [];
  const imageUrls = [];

  const sendMessage = () => {
    if (socket && inputMessage.trim() && chatRoomId) {
      messageType.push("text");
      console.log("message type", messageType);

      socket.emit("sendMessage", {
        chatRoomId,
        inputMessage,
        userId,
        messageType,
        imageUrls,
      });
      setInputMessage("");
    }
  };

  return (
    <div>
      <NavBar />

      <h1>Two-Person Chat</h1>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message..."
        className="text-white"
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className={`${msg.sender_id === userId ? "text-right" : "text-left"}`}
          >
            <strong>{msg.sender_id === userId ? "You" : "Other"}:</strong>{" "}
            {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
