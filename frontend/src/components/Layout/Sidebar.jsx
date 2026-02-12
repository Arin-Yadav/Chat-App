// import axios from "axios";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { showToast } from "../../helpers/ShowToast";

// const Sidebar = () => {
//   const [roomName, setRoomName] = useState("");
//   // const rooms = useSelector((state) => state.rooms.list);
//   const fullUser = useSelector((state) => state.user);
//   const username = fullUser?.user?.user;
//   console.log(username);

//   const handleCreateRoom = async (data) => {
//     console.log(data);
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_API_URL}/rooms/create`,
//         data,
//         { withCredentials: true },
//       );
//       showToast("success", "Room created successfully");
//       console.log(response.data);
//     } catch (error) {
//       showToast(
//         "error",
//         error.response?.data?.message || "Login failed. Please try again.",
//       );
//     }
//   };

//   return (
//     <div className="w-64 text-gray-800 border-r border-gray-400 p-4 flex flex-col">
//       <h2 className="text-xl font-bold mb-4">Rooms</h2>

//       {/* Create Room */}
//       <form onSubmit={handleCreateRoom}>
//         <input
//           type="text"
//           value={roomName}
//           onChange={(e) => setRoomName(e.target.value)}
//           placeholder="New room name"
//           className="w-full p-2 rounded text-black"
//         />
//         <button
//           type="submit"
//           className="w-full mt-2 bg-blue-500 text-white p-2 rounded">
//           Create Room
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Sidebar;

import axios from "axios";
import { useSelector } from "react-redux";
import { showToast } from "../../helpers/ShowToast";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const Sidebar = ({ onSelectRoom }) => {
  const fullUser = useSelector((state) => state.user);
  const user = fullUser?.user?.user;
  const userId = user.id;

  const [rooms, setRooms] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch rooms on mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/rooms/getRooms`,
          { withCredentials: true },
        );
        setRooms(response.data.rooms);
      } catch (error) {
        showToast(
          "error",
          error.response?.data?.message || "Failed to fetch rooms",
        );
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async (data) => {
    try {
      const payload = {
        roomName: data.roomName,
        userId,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms/create`,
        payload,
        { withCredentials: true },
      );

      showToast("success", "Room created successfully");
      reset();

      // Refresh rooms list after creating
      setRooms((prev) => [...prev, response.data.room]);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message ||
          "Room creation failed. Please try again.",
      );
    }
  };

  return (
    <div className="w-64 text-gray-800 border-r border-gray-400 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Rooms</h2>

      {/* Display Rooms */}
      <ul className="mt-4 space-y-2">
        {rooms.map((room) => (
          <li
            key={room._id}
            onClick={() => onSelectRoom(room)}
            className="p-2 bg-gray-100 rounded hover:bg-gray-200 cursor-pointer">
            {room.roomName}
          </li>
        ))}
      </ul>

      {/* Create Room */}
      <form onSubmit={handleSubmit(handleCreateRoom)}>
        <input
          type="text"
          placeholder="New room name"
          className="w-full p-2 rounded text-black"
          {...register("roomName", { required: "Room name is required" })}
        />
        {errors.roomName && (
          <p className="text-red-500 text-sm mt-1">{errors.roomName.message}</p>
        )}

        <button
          type="submit"
          className="w-full mt-2 bg-blue-500 text-white p-2 rounded">
          Create Room
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
