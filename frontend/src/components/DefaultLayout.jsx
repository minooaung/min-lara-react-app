import { Link, Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/queries/useAuth";

export default function DefaultLayout() {
  const reduxUser = useSelector((state) => state.auth.user);
  const notification = useSelector(
    (state) => state.notification.notificationMessage
  );
  const { mutate: logout } = useLogout();

  const isAuthenticated = !!reduxUser;

  // Periodically refresh session every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Session refreshed");
      axiosClient.get("/user").catch(() => {
        logout();
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();
    logout();
  };

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/organisations">Organisations</Link>
        <Link to="/report">Report</Link>
      </aside>
      <div className="content">
        <header>
          <div></div>
          <div>
            {reduxUser?.name}
            <a href="#" onClick={onLogout} className="btn-logout">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}
