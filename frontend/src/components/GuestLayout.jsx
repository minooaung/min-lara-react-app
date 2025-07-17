import { Navigate, Outlet } from "react-router-dom";

//import { useStateContext } from "../contexts/ContextProvider";

import { useSelector } from "react-redux";
import Banner from "./Banner"; // Adjust the path as needed

export default function GuestLayout() {
  // Via Context API
  //const { token } = useStateContext();

  const reduxUserToken = useSelector((state) => state.auth.token);

  // debugger;
  // if (token) {
  if (reduxUserToken) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Banner />
      <Outlet />
    </div>
  );
}
