import { Navigate, Outlet } from "react-router-dom";

//import { useStateContext } from "../contexts/ContextProvider";

import { useSelector } from "react-redux";

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
      <Outlet />
    </div>
  );
}
