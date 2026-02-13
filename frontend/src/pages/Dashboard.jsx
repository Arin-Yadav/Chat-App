import { useState } from "react";
// import { fetchRooms, createRoom } from "../store/roomSlice";
import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import ChatPage from "./ChatPage";

const Dashboard = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar onSelectRoom={setSelectedRoom} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {!selectedRoom ? (
            <div className="flex flex-col items-center justify-center flex-1">
              <p className="text-gray-600 mb-4">
                Create or Join a room to start chatting
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
