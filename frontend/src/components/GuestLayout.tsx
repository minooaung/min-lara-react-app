import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/types";

export default function GuestLayout() {
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  if (reduxUser) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
} 