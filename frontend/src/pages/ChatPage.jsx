// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { showToast } from "../helpers/ShowToast";
// import dayjs from "dayjs";

// // ✅ Memoized message bubble
// const MessageBubble = React.memo(({ msg, userId }) => {
//   const isOwnMessage = msg.sender._id === userId;
//   return (
//     <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
//       <div
//         className={`relative px-3 py-2 rounded-lg text-sm wrap-break-word ${isOwnMessage ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none"} max-w-[75%] sm:max-w-[60%] md:max-w-[50%]`}>
//         {/* Message text */} <p className="whitespace-pre-wrap">{msg.text}</p>
//         {/* Footer with sender + time */}
//         <div className="flex gap-2 justify-between items-center mt-1 text-xs opacity-70">
//           <span>{msg.sender.username}</span>
//           <span className="text-xs">
//             {dayjs(msg.createdAt).format("h:mm A")}
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// });

// // ✅ Memoized message list
// const MessageList = React.memo(({ messages, userId }) => (
//   <div className="flex-1 overflow-y-auto p-4 space-y-2">
//     {messages.map((msg) => (
//       <MessageBubble key={msg._id} msg={msg} userId={userId} />
//     ))}
//   </div>
// ));

// const ChatPage = ({ room }) => {
//   const fullUser = useSelector((state) => state.user);
//   const user = fullUser?.user?.user;
//   const userId = user.id;

//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");

//   // Fetch messages when room changes
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_URL}/messages/${room._id}`,
//           { withCredentials: true },
//         );
//         setMessages(res.data.messages);
//       } catch (error) {
//         console.log(error);
//         showToast("error", "Failed to load messages");
//       }
//     };
//     if (room?._id) fetchMessages();
//   }, [room]);

//   // Send message
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!text.trim()) return;

//     try {
//       const payload = { roomId: room._id, senderId: userId, text };

//       const res = await axios.post(
//         `${import.meta.env.VITE_API_URL}/messages/send`,
//         payload,
//         { withCredentials: true },
//       );

//       // Note:- remember Backend should populate sender before returning
//       setMessages((prev) => [...prev, res.data.message]);
//       setText("");
//     } catch (error) {
//       console.log(error);
//       showToast("error", "Failed to send message");
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-gray-100">
//       {/* Header */}
//       <div className="p-4 bg-white border-b flex items-center">
//         <h2 className="font-semibold text-lg">{room.roomName}</h2>
//       </div>

//       {/* Messages */}
//       <MessageList messages={messages} userId={userId} />

//       {/* Input */}
//       <form
//         onSubmit={handleSend}
//         className="p-4 bg-white border-t flex items-center gap-2">
//         <input
//           type="text"
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           placeholder="Type a message"
//           className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
//           Send
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatPage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { showToast } from "../helpers/ShowToast";
import { useSocket } from "../hooks/useSocket";
import axios from "axios";

const MessageBubble = React.memo(({ msg, userId }) => {
  const isOwnMessage = msg.sender._id === userId;
  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`relative px-3 py-2 rounded-lg text-sm wrap-break-word ${
          isOwnMessage
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-800 rounded-bl-none"
        } max-w-[75%] sm:max-w-[60%] md:max-w-[50%]`}>
        <p className="whitespace-pre-wrap">{msg.text}</p>
        <div className="flex gap-2 justify-between items-center mt-1 text-xs opacity-70">
          <span>{msg.sender.username}</span>
          <span>{dayjs(msg.createdAt).format("h:mm A")}</span>
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
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <MessageBubble key={msg._id} msg={msg} userId={userId} />
      ))}
      {/* Invisible div to scroll into view */}
      <div ref={bottomRef} />
    </div>
  );
});

const ChatPage = ({ room }) => {
  const fullUser = useSelector((state) => state.user);
  const user = fullUser?.user?.user;
  const userId = user.id;
  const username = user.username;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);

  // ✅ Use socket with callback
  const { sendMessage, startTyping, stopTyping } = useSocket(
    room._id,
    userId,
    (message) => {
      setMessages((prev) => [...prev, message]);
    },
    (username) => setTypingUsers((prev) => [...new Set([...prev, username])]),
    (username) => setTypingUsers((prev) => prev.filter((u) => u !== username)),
  );

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
    let typingTimeout;
    const value = e.target.value;
    setText(value);

    if (value) {
      startTyping(username);
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => stopTyping(username), 2000); // stop after 2s idle
    } else {
      stopTyping(username);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    sendMessage(text); // ✅ socket handles sending
    setText("");
    stopTyping(username);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-100">
      <div className="p-4 bg-white border-b flex items-center">
        <div className="flex flex-col">
          <h2 className="font-semibold text-sm">Chatting in {room.roomName}</h2>
          {/* typing indicator */}
          {typingUsers.length > 0 && (
            <div className="text-sm text-green-500">
              {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}
              typing...
            </div>
          )}
        </div>
      </div>

      <MessageList messages={messages} userId={userId} />

      <form
        onSubmit={handleSend}
        className="p-4 bg-white border-t flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={handleInputChange}
          placeholder="Type a message"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;
