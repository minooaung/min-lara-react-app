import { Link, Navigate, Outlet } from "react-router-dom";

// import { useStateContext } from "../contexts/ContextProvider";

import { useEffect } from "react";
import axiosClient from "../axios-client";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";

export default function DefaultLayout() {
  // Via Context API
  // const { user, token, notification, setUser, setToken } = useStateContext();

  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const reduxUserToken = useSelector((state) => state.auth.token);
  const notification = useSelector(
    (state) => state.notification.notificationMessage
  );

  // ✅ Ensure useEffect runs first before returning JSX
  // This no longer needed
  //   useEffect(() => {
  //     console.log("useEffect executed");

  //     if (reduxUserToken) {
  //       axiosClient.get("/user").then(({ data }) => {
  //         //   setUser(data);

  //         dispatch(authActions.settingUser(data));
  //       });
  //     }
  //   }, [dispatch]);

  // ✅ Move this check AFTER the useEffect to avoid breaking hook order
  //if (!token) {
  if (!reduxUserToken) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      // Via Context API
      //   setUser({});
      //   setToken(null);

      // Try using redux instead of Context Provider
      dispatch(authActions.settingUser({}));
      dispatch(authActions.settingToken(null));
    });
  };

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
      </aside>
      <div className="content">
        <header>
          <div></div>
          <div>
            {/* {user.name}  */}
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
