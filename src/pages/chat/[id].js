import { IoSend } from "react-icons/io5";
import { PiImageFill } from "react-icons/pi";
import { IoIosArrowBack } from "react-icons/io";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/router";

import { useAuth } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import LeftSidebar from "@/components/matches/LeftSidebar";
import { ChatBubble } from "@/components/CustomUi";

function CustomChatButton({ onClick, className, Icon }) {
  return (
    <button
      type="button"
      className={`rounded-full p-3 shadow-md transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <Icon className="size-5" />
    </button>
  );
}

export default function Chat() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [socket, setSocket] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [otherUserData, setOtherUserData] = useState(null);

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

        // Fetch other user data and old messages
        const messagesResponse = await axios.get(
          `${apiBaseUrl}/api/chat/chatHistory?chatRoomId=${chatRoomId}&userId=${state.user?.id}`,
        );

        if (messagesResponse.data?.messages) {
          setMessages(messagesResponse.data.messages);
          setOtherUserData(messagesResponse.data.otherUserData);
        }

        console.log("other_user:", messagesResponse.data.otherUserData);
      } catch (error) {
        console.error("Failed to fetch user or chat room details:", error);
      }
    };

    fetchChatRoom();
  }, [chatRoomId]);

  // Scroll to the bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
    <main className="items flex min-h-screen flex-col bg-utility-bg">
      <NavBar />

      <div className="flex flex-grow">
        <LeftSidebar />

        <section className="relative w-full">
          {/* Back button */}
          <div className="flex h-14 w-full items-center gap-3 bg-utility-primary px-4 md:px-12 lg:hidden">
            <button
              type="button"
              onClick={() => {
                router.push("/");
              }}
            >
              <IoIosArrowBack className="size-6 text-fourth-700 transition-colors duration-300 hover:text-fourth-600" />
            </button>
            <p className="text-lg font-semibold text-fourth-900">
              {otherUserData?.name}
            </p>
          </div>

          {/* Messages section */}
          <div
            ref={scrollRef}
            className="scrollable-element max-h-[calc(100vh-184px)] overflow-y-scroll px-4 lg:max-h-[calc(100vh-160px)] lg:px-20"
          >
            <div className="container mx-auto flex flex-col items-center justify-start gap-8">
              {/* Alert section */}
              {messages.length === 0 && (
                <div className="mt-10 flex max-w-fit items-center justify-center gap-5 rounded-2xl border-2 border-second-300 bg-second-100 p-4 lg:mt-28 lg:px-20 lg:py-6">
                  <svg
                    className="min-h-10 min-w-16 text-primary-400"
                    width="61"
                    height="36"
                    viewBox="0 0 61 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20.717 31.0768L20.7223 31.0795L20.7412 31.0909L20.7748 31.1077C21.1203 31.287 21.504 31.3803 21.8935 31.3798C22.1799 31.3794 22.4631 31.3281 22.7301 31.2293H22.8113L23.0609 31.0795L23.0662 31.0768L23.0742 31.0726L23.082 31.0683C25.4842 29.7547 27.744 28.1962 29.8256 26.4177L29.8293 26.4145C33.0936 23.6006 37.0196 19.1429 37.0196 13.6251V13.625C37.0194 11.7633 36.4421 9.94746 35.3671 8.42747C34.2922 6.90748 32.7724 5.75812 31.0172 5.13764C29.2619 4.51716 27.3575 4.45608 25.5661 4.96281C24.1893 5.35225 22.9314 6.06237 21.8916 7.02753C20.8518 6.06237 19.5939 5.35225 18.2171 4.96281C16.4257 4.45608 14.5213 4.51716 12.766 5.13764C11.0108 5.75812 9.49104 6.90748 8.41608 8.42747C7.34113 9.94746 6.76382 11.7633 6.76364 13.625V13.6251C6.76364 19.143 10.6916 23.6007 13.9536 26.4143L13.9575 26.4176C15.4224 27.6695 16.9765 28.8131 18.6074 29.8393C19.2925 30.2719 19.9915 30.6822 20.7033 31.0694L20.7101 31.0731L20.717 31.0768Z"
                      fill="#FF1659"
                      stroke="white"
                      strokeWidth="2.25592"
                    />
                    <path
                      d="M41.717 31.0768L41.7223 31.0795L41.7412 31.0909L41.7748 31.1077C42.1203 31.287 42.504 31.3803 42.8935 31.3798C43.1799 31.3794 43.4631 31.3281 43.7301 31.2293H43.8113L44.0609 31.0795L44.0662 31.0768L44.0742 31.0726L44.082 31.0683C46.4842 29.7547 48.744 28.1962 50.8256 26.4177L50.8293 26.4145C54.0936 23.6006 58.0196 19.1429 58.0196 13.6251V13.625C58.0194 11.7633 57.4421 9.94746 56.3671 8.42747C55.2922 6.90748 53.7724 5.75812 52.0172 5.13764C50.2619 4.51716 48.3575 4.45608 46.5661 4.96281C45.1893 5.35225 43.9314 6.06237 42.8916 7.02753C41.8518 6.06237 40.5939 5.35225 39.2171 4.96281C37.4257 4.45608 35.5213 4.51716 33.766 5.13764C32.0108 5.75812 30.491 6.90748 29.4161 8.42747C28.3411 9.94746 27.7638 11.7633 27.7636 13.625V13.6251C27.7636 19.143 31.6916 23.6007 34.9536 26.4143L34.9575 26.4176C36.4224 27.6695 37.9765 28.8131 39.6074 29.8393C40.2925 30.2719 40.9915 30.6822 41.7033 31.0694L41.7101 31.0731L41.717 31.0768Z"
                      fill="#FF1659"
                      stroke="white"
                      strokeWidth="2.25592"
                    />
                  </svg>

                  <div className="text-sm font-semibold text-primary-700">
                    <p>Now you and {otherUserData?.name} are Merry Match!</p>
                    <p>
                      You can messege something nice and make a good
                      conversation. Happy Merry!
                    </p>
                  </div>
                </div>
              )}

              {/* Text section */}
              <ul className="flex w-full flex-col gap-3 py-6">
                {messages.map((msg, index) => {
                  const isLastOfGroup =
                    index === messages.length - 1 ||
                    messages[index + 1].sender_id !== msg.sender_id;

                  // Check spacing between words for word wrapping
                  const noSpace = !msg.content.includes(" ");

                  return (
                    <li
                      key={index}
                      className={`${msg.sender_id === userId ? "self-end" : "self-start"}`}
                    >
                      <div className="flex items-end gap-4">
                        {msg.sender_id !== userId && (
                          <div className="flex size-12 overflow-hidden rounded-full">
                            {isLastOfGroup && (
                              <img
                                src={otherUserData?.image_profile}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                        )}

                        <ChatBubble
                          className={`flex min-h-14 !w-full max-w-[20rem] items-center justify-center text-start sm:max-w-[25rem] lg:max-w-[27.5rem] lg:text-lg ${msg.sender_id === userId ? "bg-second-600 text-utility-primary" : "border border-fourth-300 bg-primary-200 text-utility-second"} ${noSpace && "break-all"}`}
                          type={`${msg.sender_id === userId ? "receiver" : "sender"}`}
                        >
                          {msg.content}
                        </ChatBubble>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Typing section */}
          <div className="absolute bottom-0 flex h-16 w-full items-center gap-3 border-t border-fourth-800 bg-utility-bg px-4 md:px-12 lg:h-20 lg:px-20">
            <CustomChatButton
              className="bg-fourth-100 text-fourth-600 hover:bg-fourth-300"
              Icon={PiImageFill}
              onClick={() => {}}
            />

            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Messege here..."
              className="h-full w-full bg-utility-bg p-3 text-utility-primary placeholder:text-fourth-500 focus:outline-none"
            />

            <CustomChatButton
              className="bg-primary-500 text-utility-primary hover:bg-primary-600 active:scale-90"
              Icon={IoSend}
              onClick={sendMessage}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
