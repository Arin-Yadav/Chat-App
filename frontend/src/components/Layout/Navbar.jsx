import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../redux/user/userSlice";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoCloseOutline } from "react-icons/io5";

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    navigate("/login");
    dispatch(removeUser());
  };

  return (
    <nav className="flex justify-between items-center bg-blue-800 text-white px-5 py-3">
      <div className="flex gap-2">
        <button
          className="lg:hidden p-2 text-white rounded-md hover:bg-gray-200"
          onClick={onToggleSidebar}>
          {sidebarOpen ? <IoCloseOutline /> : <RxHamburgerMenu />}
        </button>
        <h1 className="text-xl font-bold">Chat App</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-2 sm:px-5 sm:py-2 rounded text-sm cursor-pointer">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
