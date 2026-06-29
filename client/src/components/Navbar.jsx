import { useAuthStore } from "../store/authStore.js";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import API from "../api/axios.js";

const Navbar = () => {
  const logout = useAuthStore((state) => state.logout);
  const setNotifications = useAuthStore((state) => state.setNotifications);
  const notifications = useAuthStore((state) => state.notifications);
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetch = async () => {
      if (!token) return;
      try {
        const notifi = await API.get("/notifications");
        setNotifications(notifi.data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetch();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav className="flex justify-between items-center py-4 px-20 border-b-[0.5px]  border-green-800">
        <div className="logo">
          <Link to="/dashboard">LOGO</Link>
        </div>
        <div className="flex gap-3 items-center">
          <div className="notification">
            <div className="icon">bell</div>
            {unreadCount > 0 && <div className="unread">{unreadCount}</div>}
          </div>

          <button
            onClick={handleLogout}
            className="bg-green-800 text-amber-50 py-2 px-5 rounded-4xl"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
