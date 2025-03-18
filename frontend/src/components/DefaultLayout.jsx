import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";

// import { useStateContext } from "../contexts/ContextProvider";

import { useEffect, useState } from "react";
import axiosClient from "../axios-client";

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";

export default function DefaultLayout() {
  // Via Context API
  // const { user, token, notification, setUser, setToken } = useStateContext();

  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);
  const notification = useSelector(
    (state) => state.notification.notificationMessage
  );
  const navigate = useNavigate(); // Use this for navigation
  //const [loading, setLoading] = useState(true); // Add a loading state

  const isAuthenticated = !!reduxUser; // Use Redux state

  // Fetch user data only if user is authenticated and reduxUser is not set yet
  useEffect(() => {
    if (reduxUser === null && isAuthenticated) {
      // Only make API call if reduxUser is null
      axiosClient
        .get("/user")
        .then(({ data }) => {
          dispatch(authActions.settingUser(data));
        })
        .catch(() => {
          dispatch(authActions.logout());
        });
    }

    // if (!reduxUser && isAuthenticated) {
    //   axiosClient
    //     .get("/user")
    //     .then(({ data }) => {
    //       dispatch(authActions.settingUser(data));
    //     })
    //     .catch(() => {
    //       dispatch(authActions.logout());
    //     })
    //     .finally(() => setLoading(false)); // Stop loading once the request completes
    // } else {
    //   setLoading(false); // Stop loading if user is already set
    // }
  }, [reduxUser, dispatch]); // Run effect only when reduxUser and dispatch changes

  // Periodically refresh session every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Session refreshed");
      axiosClient.get("/user").catch(() => {
        dispatch(authActions.logout());
      });
    }, 5 * 60 * 1000); // 5 or 10 minutes

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [dispatch]);

  // if (loading) {
  //   return <p>Data Loading...</p>; // Show loading until user data is determined
  // }

  if (!isAuthenticated) {
    console.log("Not Authenticated");
    return <Navigate to="/login" />; // Here must be returned
    // navigate("/login"); // Redirecting does not work
  } else {
    console.log("Authenticated");
    //console.log(reduxUser);
  }

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      // Via Context API
      //   setUser({});
      //   setToken(null);

      dispatch(authActions.logout());

      navigate("/login"); // Redirect properly after logout
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
