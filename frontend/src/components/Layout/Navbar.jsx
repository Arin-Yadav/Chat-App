import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../redux/user/userSlice";

const Navbar = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigate("/login");
    dispatch(removeUser());
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-3">
      {/* Hamburger button only on small screens */}
      <button
        className="lg:hidden p-2 text-gray-700 rounded-md hover:bg-gray-200"
        onClick={onToggleSidebar}>
        ☰
      </button>
      <h1 className="text-xl font-bold">Chat App</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm cursor-pointer">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
