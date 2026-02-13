import axios from "axios";
import { useSelector } from "react-redux";
import { showToast } from "../../helpers/ShowToast";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";

const Sidebar = ({ isOpen, onSelectRoom, onClose }) => {
  const fullUser = useSelector((state) => state.user);
  const user = fullUser?.user?.user;
  const userId = user?.id;
  const username = user?.username;

  const [rooms, setRooms] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
      const payload = { roomName: data.roomName, userId };
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/rooms/create`,
        payload,
        { withCredentials: true },
      );

      showToast("success", "Room created successfully");
      reset();
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
    <>
      {/* Overlay (mobile only) */}
      {isOpen && (
        <div className="fixed inset-0 lg:hidden z-30" onClick={onClose} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-16 left-0 h-[calc(100vh-64px)] lg:h-auto w-64 bg-linear-to-b from-white to-gray-50 text-gray-800 border-r shadow-sm p-4 flex flex-col transform transition-transform duration-300 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* User Greeting */}
        <div className="mb-4 pb-2 border-b">
          <p className="text-sm pt-2 text-gray-600">
            Hello,
            {
              <span className="text-lg ml-1 font-semibold text-blue-600">
                {username}
              </span>
            }
          </p>
        </div>

        {/* Rooms Header */}
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Available Rooms
        </h4>

        {/* Rooms list */}
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <li
                key={room._id}
                onClick={() => {
                  onSelectRoom(room);
                  onClose(); // auto-close on mobile
                }}
                className="p-2 rounded-md bg-gray-100 hover:bg-blue-50 hover:text-blue-600 
                     cursor-pointer transition-colors duration-200">
                {room.roomName}
              </li>
            ))
          ) : (
            <li className="p-2 text-center text-gray-400 italic">
              No rooms available
            </li>
          )}
        </ul>

        {/* Create Room */}
        <form
          onSubmit={handleSubmit(handleCreateRoom)}
          className="mt-4 space-y-2">
          <input
            type="text"
            placeholder="New room name"
            className="w-full p-2 rounded-md border border-gray-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            {...register("roomName", { required: "Room name is required" })}
          />
          {errors.roomName && (
            <p className="text-red-500 text-xs">{errors.roomName.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-500 to-indigo-500 
                 text-white py-2 rounded-md font-medium 
                 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            Create Room
          </button>
        </form>
      </div>
    </>
  );
};

export default Sidebar;
