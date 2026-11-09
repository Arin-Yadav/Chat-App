// hooks/useSocket.js
import { useCallback, useEffect, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = (
  roomId,
  userId,
  onMessageReceived,
  onTyping,
  onStopTyping,
) => {
  const socketRef = useRef(null);
  const callbacksRef = useRef({});

  useEffect(() => {
    callbacksRef.current = { onMessageReceived, onTyping, onStopTyping };
  });

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:5000");
    }

    const socket = socketRef.current;

    if (roomId) {
      socket.emit("joinRoom", roomId);
    }

    socket.on("receiveMessage", (message) => {
      callbacksRef.current.onMessageReceived?.(message);
    });

    socket.on("userTyping", ({ username }) => {
      callbacksRef.current.onTyping?.(username);
    });

    socket.on("userStopTyping", ({ username }) => {
      callbacksRef.current.onStopTyping?.(username);
    });

    return () => {
      if (roomId) {
        socket.emit("leaveRoom", roomId);
      }
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStopTyping");
    };
  }, [roomId]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback(
    (text) => {
      if (roomId && userId && socketRef.current) {
        const msg = { roomId, sender: userId, text };
        socketRef.current.emit("sendMessage", msg);
      }
    },
    [roomId, userId],
  );

  const startTyping = useCallback(
    (username) => {
      if (roomId && username) {
        socketRef.current?.emit("typing", { roomId, username });
      }
    },
    [roomId],
  );

  const stopTyping = useCallback(
    (username) => {
      if (roomId && username) {
        socketRef.current?.emit("stopTyping", { roomId, username });
      }
    },
    [roomId],
  );

  return { sendMessage, startTyping, stopTyping };
};
