import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSocket } from "../hooks/useSocket";
import { useState, useEffect } from "react";
import Navbar from "../components/Layout/Navbar";
import MessageBubble from "../components/Chat/MessageBubble";
import { fetchMessages } from "../store/messageSlice";
import { useDispatch } from "react-redux";
import { showToast } from "../helpers/ShowToast";

const ChatPage = ({ room }) => {
  // const { roomId } = useParams();
  const dispatch = useDispatch();
  const fullUser = useSelector((state) => state.user);
  const user = fullUser?.user?.user;
  const username = user.username;

  // const { byRoom, isLoading, isError, error } = useSelector(
  //   (state) => state.messages,
  // );
  // const messages = byRoom[roomId] || [];

  const { sendMessage } = useSocket(roomId, username);
  const [text, setText] = useState("");

  // useEffect(() => {
  //   if (roomId) {
  //     dispatch(fetchMessages(roomId));
  //   }
  // }, [dispatch, roomId]);

  const handleSend = () => {
    if (text.trim()) {
      try {
        sendMessage(text);
        setText("");
        showToast("success", "Message sent!");
      } catch {
        showToast("error", "Failed to send message");
      }
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* {!isLoading &&
          !isError &&
          Array.isArray(messages) &&
          messages.length === 0 && (
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          )}
        {messages.map((msg) => (
          <MessageBubble key={msg._id} message={msg} currentUser={username} />
        ))} */}
      </div>
      <div className="flex p-2 border-t bg-white">
        <input
          className="flex-1 border rounded p-2 mr-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
