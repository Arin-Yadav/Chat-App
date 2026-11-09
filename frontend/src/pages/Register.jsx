import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "../helpers/ShowToast";
import { RouteLogin } from "../helpers/RouteName";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        data,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        showToast("success", "Registered successfully");
        navigate(RouteLogin);
      }
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col gap-2 pb-5">
          <h2 className="text-3xl font-extrabold text-center text-blue-600">
            Create Account
          </h2>
          <p className="text-center text-sm text-gray-600">
            Join us and start chatting today
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // basic email regex
                  message: "Please enter a valid email address",
                },
                minLength: {
                  value: 5,
                  message: "Email must be at least 5 characters",
                },
                maxLength: {
                  value: 50,
                  message: "Email cannot exceed 50 characters",
                },
              })}
              className="w-full px-3 py-2 mt-1 outline-none border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              className="w-full px-3 py-2 mt-1 outline-none border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
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
              className="w-full px-3 py-2 mt-1 outline-none border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 text-sm"
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
            className="w-full py-2 mt-2 text-white bg-linear-to-r from-purple-600 to-blue-600 rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 transition">
            Register
          </button>

          <p className="text-sm text-center text-gray-700">
            Already have an account?
            <Link to="/login" className="text-purple-600 ml-1 hover:underline">
              Login now
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
