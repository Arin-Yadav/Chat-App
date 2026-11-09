import React, { useCallback, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { useSelector } from "react-redux";
import { showToast } from "../helpers/ShowToast";
import { useSocket } from "../hooks/useSocket";

const MessageBubble = React.memo(({ msg, userId }) => {
  const isOwnMessage = msg?.sender?._id === userId;

  const username =
    msg?.sender?.username?.charAt(0).toUpperCase() +
    msg?.sender?.username?.slice(1);

  return (
    <div
      className={`flex items-start gap-2 mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      {/* Profile */}
      {!isOwnMessage && (
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white text-xs font-semibold shrink-0">
          {username?.charAt(0)}
        </div>
      )}

      <div
        className={`max-w-[80%] md:max-w-[60%] px-4 py-3 rounded-2xl shadow-sm wrap-break-word ${
          isOwnMessage
            ? "bg-green-500 text-white rounded-br-md"
            : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
        }`}>
        {!isOwnMessage && (
          <p className="text-xs font-semibold text-indigo-600 mb-1">
            {username}
          </p>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {msg?.text}
        </p>

        <div
          className={`flex justify-end mt-2 text-[11px] ${
            isOwnMessage ? "text-green-100" : "text-gray-400"
          }`}>
          {dayjs(msg?.createdAt).format("h:mm A")}
        </div>
      </div>
    </div>
  );
});

const MessageList = React.memo(({ messages, userId }) => {
  const bottomRef = React.useRef(null);

  // Scroll to bottom whenever messages change
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="flex min-h-full flex-col justify-end space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} msg={msg} userId={userId} />
        ))}
        {/* keeps the message at the bottom */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
});

const ChatPage = ({ room }) => {
  const fullUser = useSelector((state) => state.user);
  const user = fullUser?.user?.user;
  const userId = user?.id;
  const username = user?.username;

  // console.log(room)

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const isTypingRef = useRef(false);

  // Use socket with callback
  const { sendMessage, startTyping, stopTyping } = useSocket(
    room._id,
    userId,
    (message) => {
      // onMessageReceived
      setMessages((prev) => [...prev, message]);
    },
    (username) => setTypingUsers((prev) => [...new Set([...prev, username])]),
    (username) => setTypingUsers((prev) => prev.filter((u) => u !== username)),
  );

  const clearTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (isTypingRef.current) {
      isTypingRef.current = false;
      stopTyping(username);
    }
  }, [stopTyping, username]);

  useEffect(() => clearTyping, [room._id, clearTyping]);

  // Fetch history when room changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/messages/${room._id}`,
          { withCredentials: true },
        );
        setMessages(res.data.messages);
      } catch (error) {
        console.log(error);
        showToast("error", "Failed to load messages");
      }
    };
    if (room?._id) fetchMessages();
  }, [room]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (value.trim()) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        startTyping(username);
      }
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(clearTyping, 2000);
    } else {
      clearTyping();
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    clearTyping();
    if (!text.trim()) return;
    sendMessage(text); // socket handles sending
    setText("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-purple-600 text-white font-semibold shadow-sm">
            {room?.roomName?.charAt(0)?.toUpperCase()}
          </div>

          {/* Room Info */}
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="truncate text-sm sm:text-base font-semibold text-gray-900">
              {room?.roomName}
            </h2>

            <div className="h-5 overflow-hidden">
              {typingUsers.length > 0 ? (
                <span className="block truncate text-xs sm:text-sm text-green-600">
                  {typingUsers.join(", ")}{" "}
                  {typingUsers.length > 1 ? "are" : "is"} typing...
                </span>
              ) : (
                // TODO => Find a way to add total members in the room object
                <span className="text-xs text-gray-500">
                  {room?.members?.length || 0} members
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageList messages={messages} userId={userId} />

      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t border-gray-300 flex items-center gap-5 px-10">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          onBlur={clearTyping}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 outline-gray-400 outline-2 focus:outline-none focus:ring-2 focus:ring-green-600"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-8 py-2 rounded-full cursor-pointer outline-none hover:bg-blue-600 transition">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
