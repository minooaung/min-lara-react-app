import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";

// import { useStateContext } from "../contexts/ContextProvider"

import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { notiActions } from "../store/notification";

export default function UserForm() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Via Context API
  // const { setNotification } = useStateContext(); // Not using Context API here, using Redux instead

  const dispatch = useDispatch();
  const reduxUser = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (!id) return; // Prevent effect from running if `id` is falsy

    setErrors(null); // Reset errors before fetching new user data

    const fetchUser = async () => {
      setLoading(true); // Start loading

      try {
        const { data } = await axiosClient.get(`/users/${id}`);
        setUser(data);
      } catch (err) {
        setErrors(handleApiError(err));
      } finally {
        setLoading(false); // Ensure loading stops in all cases
      }
    };

    fetchUser();
  }, [id]); // Include `id` as dependency to avoid unnecessary re-runs

  const onSubmit = async (ev) => {
    ev.preventDefault();

    setErrors(null); // Reset errors before new request

    try {
      let response;
      if (user.id) {
        response = await axiosClient.put(`/users/${user.id}`, user);
        dispatch(notiActions.settingNotiMessage("User updated successfully"));

        // Extract response data and update user in Redux store
        console.log("Login user from Redux store:", reduxUser);
        if (reduxUser && reduxUser.id === user.id) {
          dispatch(authActions.settingUser(response.data));
        }
      } else {
        await axiosClient.post(`/users`, user);
        dispatch(notiActions.settingNotiMessage("User created successfully"));
      }

      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
      navigate("/users");
    } catch (err) {
      setErrors(handleApiError(err));
    }
  };

  const onCancel = () => {
    navigate("/users");
  };

  return (
    <>
      {user.id && <h1>Update User: {user.name}</h1>}
      {!user.id && <h1>New User</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && (
          <>
            <form onSubmit={onSubmit}>
              <input
                value={user.name}
                onChange={(ev) => setUser({ ...user, name: ev.target.value })}
                placeholder="Name"
              />
              <input
                type="email"
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Email"
              />
              <select
                name="role"
                value={user.role}
                onChange={(ev) => setUser({ ...user, role: ev.target.value })}
                disabled={!!user.id} // Disable dropdown if updating an existing user
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="ADMIN">ADMIN</option>
                <option value="EMPLOYEE">EMPLOYEE</option>
              </select>
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder="Password"
              />
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder="Password Confirmation"
              />
              <button className="btn" onClick={onCancel}>
                Cancel
              </button>{" "}
              <button className="btn">Save</button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
