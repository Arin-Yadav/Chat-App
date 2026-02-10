import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRooms, createRoom } from "../store/roomSlice";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import { toast } from "react-toastify";

const Dashboard = () => {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.user.username);
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleCreateRoom = async () => {
    if (roomName.trim()) {
      try {
        await dispatch(
          createRoom({ name: roomName, createdBy: username }),
        ).unwrap();
        toast.success("Room created successfully!");
        setRoomName("");
      } catch (err) {
        // console.log(err)
        toast.error("Failed to create room", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          {rooms.length === 0 && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                No rooms yet. Create one below!
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Enter room name"
                  className="border rounded px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  onClick={handleCreateRoom}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Create
                </button>
              </div>
            </div>
          )}
          {rooms.length > 0 && (
            <h1 className="text-2xl font-semibold text-gray-700">
              Select a room from the sidebar to start chatting
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
