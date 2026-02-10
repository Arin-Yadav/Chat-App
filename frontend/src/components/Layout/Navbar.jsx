import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../../redux/user/userSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  
  const user = useSelector((state) => state.user);
  const username = user.username;

  const handleLogout = () => {
    navigate("/login");
    dispatch(removeUser())
  };

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-3">
      <h1 className="text-xl font-bold">Chat App</h1>
      <div className="flex items-center gap-4">
        {username && <span className="text-sm">Hello, {user}</span>}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
