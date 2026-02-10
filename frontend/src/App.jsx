import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import {
  RouteDashboard,
  RouteIndex,
  RouteLogin,
  RouteRegister,
} from "./helpers/RouteName.js";
import Home from "./pages/Home";
import PrivateRoute from "./components/Auth/PrivateRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ChatPage from "./pages/ChatPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={RouteIndex} element={<Home />} />
        <Route path={RouteLogin} element={<Login />} />
        <Route path={RouteRegister} element={<Register />} />
        <Route
          path={RouteDashboard}
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
