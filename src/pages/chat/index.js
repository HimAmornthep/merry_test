import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const roomId = "chat-room";

  useEffect(() => {
    const socketIo = io({ path: "/api/chat/socket" });

    socketIo.on("connect", () => {
      console.log("Connected:", socketIo.id);
      socketIo.emit("joinRoom", roomId);
    });

    socketIo.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("sendMessage", { roomId, message });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Two-Person Chat</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="text-white"
      />
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((msg, idx) => (
          <li
            key={idx}
            className={`${msg.senderId === socket.id ? "text-right" : "text-left"}`}
          >
            <strong>{msg.senderId === socket.id ? "You" : "Other"}:</strong>{" "}
            {msg.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
