import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-100">
      {/* Navbar */}
      <header className="flex items-center justify-between h-16 px-6 py-4 bg-white/80 backdrop-blur shadow-md fixed w-full top-0 z-50">
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-purple-600">
          Chatify
        </h1>
        <nav className="space-x-6">
          {/* <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
            Dashboard
          </Link> */}
          <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6 pt-24">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6 leading-tight">
          Connect. <span className="text-blue-600">Chat.</span> Collaborate.
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          A modern, real-time chat application built for seamless communication
          across teams and communities. Simple, fast, and responsive.
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-linear-to-br from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:scale-105 transform transition"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="px-6 py-12 bg-white/70 backdrop-blur">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose Chatify?
        </h3>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition bg-linear-to-br from-blue-50 to-white">
            <h4 className="text-xl font-semibold mb-3 text-blue-600">⚡ Real‑Time Messaging</h4>
            <p className="text-gray-600">
              Instant communication powered by Socket.IO for smooth, live chat.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition bg-linear-to-br from-purple-50 to-white">
            <h4 className="text-xl font-semibold mb-3 text-purple-600">📱 Responsive Design</h4>
            <p className="text-gray-600">
              Optimized for mobile and desktop, ensuring a consistent experience.
            </p>
          </div>
          <div className="p-6 border rounded-xl shadow hover:shadow-lg transition bg-linear-to-br from-pink-50 to-white">
            <h4 className="text-xl font-semibold mb-3 text-pink-600">🛠 Room Management</h4>
            <p className="text-gray-600">
              Create and join rooms effortlessly to organize your conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 bg-linear-to-br from-blue-600 to-purple-600 text-center text-white">
        © {new Date().getFullYear()} Chatify. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
