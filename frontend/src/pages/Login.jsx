import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../helpers/ShowToast";
import { RouteDashboard } from "../helpers/RouteName";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data,
        { withCredentials: true },
      );
      showToast("success", "Login successfully");
      dispatch(setUser(response.data));
      navigate(RouteDashboard);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.message || "Login failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-purple-100 px-4">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-blue-600">
          Welcome Back
        </h2>
        <p className="text-center text-gray-600">Please login to continue</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 mt-2 text-white bg-linear-to-r cursor-pointer from-blue-600 to-purple-600 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
            Login
          </button>

          <p className="text-sm text-center text-gray-700">
            Don't have an account?
            <Link to="/register" className="text-blue-600 ml-1 hover:underline">
              Register now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
