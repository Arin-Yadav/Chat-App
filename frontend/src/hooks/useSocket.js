import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { addMessage } from "../store/messageSlice";

export const useSocket = (roomId, username) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    // Create new socket connection per user
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000", {
        auth: { username }, // Send username to server
      });
    }

    const socket = socketRef.current;

    // Join room
    if (roomId) {
      socket.emit("joinRoom", roomId);
    }

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      dispatch(addMessage({ roomId: message.roomId, message }));
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId, username, dispatch]);

  useEffect(() => {
    // Cleanup socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Send message
  const sendMessage = (text) => {
    if (roomId && username && socketRef.current) {
      const msg = { roomId, sender: username, text };
      socketRef.current.emit("sendMessage", msg);
      // Optimistic update
      dispatch(addMessage({ roomId, message: msg }));
    }
  };

  return { sendMessage };
};
