import { useState } from "react";
// import { fetchRooms, createRoom } from "../store/roomSlice";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import ChatPage from "./ChatPage";

const Dashboard = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);

  // useEffect(() => {
  //   dispatch(fetchRooms());
  // }, [dispatch]);

  // const handleCreateRoom = async () => {
  //   if (roomName.trim()) {
  //     try {
  //       await dispatch(
  //         createRoom({ name: roomName, createdBy: username }),
  //       ).unwrap();
  //       toast.success("Room created successfully!");
  //       setRoomName("");
  //     } catch (err) {
  //       // console.log(err)
  //       toast.error("Failed to create room", err);
  //     }
  //   }
  // };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onSelectRoom={setSelectedRoom} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {!selectedRoom ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-gray-600 mb-4">
                Select a room from the sidebar to start chatting
              </p>
            </div>
          ) : (
            <ChatPage room={selectedRoom} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
