import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../../store/roomSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  // const rooms = useSelector((state) => state.rooms.list);
  const username = useSelector((state) => state.user?.username);

  const [roomName, setRoomName] = useState("");

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      dispatch(createRoom({ name: roomName, createdBy: username }));
      setRoomName("");
    }
  };

  return (
    <div className="w-64 text-gray-800 border-r border-gray-400 p-4 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Rooms</h2>
      {/* <ul className="flex-1 overflow-y-auto">
        {Array.isArray(rooms) && rooms.map((room) => (
          <li
            key={room._id}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded"
            onClick={() => navigate(`/chat/${room._id}`)}>
            {room.name}
          </li>
        ))}
      </ul> */}

      {/* Create Room */}
      <div className="mt-4">
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="New room name"
          className="w-full p-2 rounded text-black"
        />
        <button
          onClick={handleCreateRoom}
          className="w-full mt-2 bg-blue-500 text-white p-2 rounded">
          Create Room
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
