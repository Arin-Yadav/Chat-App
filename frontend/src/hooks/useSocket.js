// import { useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import { useDispatch } from "react-redux";
// import { addMessage } from "../store/messageSlice";

// export const useSocket = (roomId, username) => {
//   const dispatch = useDispatch();
//   const socketRef = useRef(null);

//   useEffect(() => {
//     // Create new socket connection per user
//     if (!socketRef.current) {
//       socketRef.current = io("http://localhost:5000", {
//         auth: { username }, // Send username to server
//       });
//     }

//     const socket = socketRef.current;
//     // Join room
//     if (roomId) {
//       socket.emit("joinRoom", roomId);
//     }

//     // Listen for incoming messages
//     socket.on("receiveMessage", (message) => {
//       dispatch(addMessage({ roomId: message.roomId, message }));
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, [roomId, username, dispatch]);

//   useEffect(() => {
//     // Cleanup socket when component unmounts
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//     };
//   }, []);

//   // Send message
//   const sendMessage = (text) => {
//     if (roomId && username && socketRef.current) {
//       const msg = { roomId, sender: username, text };
//       socketRef.current.emit("sendMessage", msg);
//       // Optimistic update
//       dispatch(addMessage({ roomId, message: msg }));
//     }
//   };

//   return { sendMessage };
// };

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
