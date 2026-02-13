// hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (
  roomId,
  userId,
  onMessageReceived,
  onTyping,
  onStopTyping,
) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");
    }

    const socket = socketRef.current;

    if (roomId) {
      socket.emit("joinRoom", roomId);
    }

    socket.on("receiveMessage", (message) => {
      if (onMessageReceived) {
        onMessageReceived(message); // callback to update local state
      }
    });

    socket.on("userTyping", ({ username }) => {
      onTyping?.(username);
    });

    socket.on("userStopTyping", ({ username }) => {
      onStopTyping?.(username);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [roomId, userId, onMessageReceived, onTyping, onStopTyping]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = (text) => {
    if (roomId && userId && socketRef.current) {
      const msg = { roomId, sender: userId, text };
      socketRef.current.emit("sendMessage", msg);
    }
  };

  const startTyping = (username) => {
    socketRef.current?.emit("typing", { roomId, username });
  };
  
  const stopTyping = (username) => {
    socketRef.current?.emit("stopTyping", { roomId, username });
  };

  return { sendMessage, startTyping, stopTyping };
};
