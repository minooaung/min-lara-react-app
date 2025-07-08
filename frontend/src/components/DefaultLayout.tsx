import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosClient from "../axios-client";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { RootState } from "../store/types";

export default function DefaultLayout() {
  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const notification = useSelector(
    (state: RootState) => state.notification.notificationMessage
  );
  const navigate = useNavigate();

  const isAuthenticated = !!reduxUser;

  useEffect(() => {
    if (!reduxUser && isAuthenticated) {
      const fetchUser = async () => {
        try {
          console.log("Fetching authenticated user data from API");
          const { data } = await axiosClient.get("/user");
          dispatch(authActions.settingUser(data));
        } catch (error) {
          dispatch(authActions.logout());
        }
      };

      fetchUser();
    }
  }, [reduxUser, dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Session refreshed");
      axiosClient.get("/user").catch(() => {
        dispatch(authActions.logout());
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (!isAuthenticated) {
    console.log("Not Authenticated");
    return <Navigate to="/login" />;
  } else {
    console.log("Authenticated");
  }

  const onLogout = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      dispatch(authActions.logout());
      navigate("/login");
    });
  };

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/organisations">Organisations</Link>
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