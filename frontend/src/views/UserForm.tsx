import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { handleApiError, ValidationErrors } from "../utils/apiErrorHandler";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import { notiActions } from "../store/notification";
import { RootState } from "../store/types";

type UserRole = "ADMIN" | "EMPLOYEE" | "";

// Base interface for common fields
interface BaseUserFormData {
  id: number | null;
  name: string;
  email: string;
  role: UserRole;
}

// Interface for creating a new user (passwords required)
interface CreateUserFormData extends BaseUserFormData {
  password: string;
  password_confirmation: string;
}

// Interface for updating a user (passwords optional)
interface UpdateUserFormData extends BaseUserFormData {
  password?: string;
  password_confirmation?: string;
}

// Combined type for all possible form states
type UserFormData = CreateUserFormData | UpdateUserFormData;

interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export default function UserForm() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);

  const dispatch = useDispatch();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [user, setUser] = useState<UserFormData>({
    id: null,
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    if (!id) return;

    setErrors(null);

    const fetchUser = async () => {
      setLoading(true);

      try {
        const { data } = await axiosClient.get<UserResponse>(`/users/${id}`);
        setUser({
          ...data,
          password: "",
          password_confirmation: "",
        });
      } catch (err) {
        setErrors(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setErrors(null);

    try {
      let response;
      if (user.id) {
        // For updates, only include password fields if they're not empty
        const updateData: UpdateUserFormData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        
        if (user.password && user.password.trim() !== "") {
          updateData.password = user.password;
          updateData.password_confirmation = user.password_confirmation;
        }

        response = await axiosClient.put<UserResponse>(`/users/${user.id}`, updateData);
        dispatch(notiActions.settingNotiMessage("User updated successfully"));

        if (reduxUser && reduxUser.id === user.id) {
          dispatch(authActions.settingUser(response.data));
        }
      } else {
        // For create, ensure all fields including passwords are present
        if (!user.password || !user.password_confirmation) {
          setErrors({
            password: ["Password and confirmation are required for new users"],
          });
          return;
        }
        await axiosClient.post<UserResponse>("/users", user);
        dispatch(notiActions.settingNotiMessage("User created successfully"));
      }

      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
      navigate("/users");
    } catch (err) {
      setErrors(handleApiError(err));
    }
  };

  const onCancel = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    navigate("/users");
  };

  return (
    <>
      {user.id && <h1>Edit : {user.name}</h1>}
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
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, name: ev.target.value })
              }
              placeholder="Name"
            />
            <input
              type="email"
              value={user.email}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, email: ev.target.value })
              }
              placeholder="Email"
            />
            <select
              name="role"
              value={user.role}
              onChange={(ev: React.ChangeEvent<HTMLSelectElement>) =>
                setUser({ ...user, role: ev.target.value as UserRole })
              }
              disabled={!!user.id}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="ADMIN">ADMIN</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
            <input
              type="password"
              value={user.password}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, password: ev.target.value })
              }
              placeholder={user.id ? "Password (optional)" : "Password"}
              required={!user.id}
            />
            <input
              type="password"
              value={user.password_confirmation}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
              placeholder={user.id ? "Password Confirmation (optional)" : "Password Confirmation"}
              required={!user.id}
            />
            <button className="btn" onClick={onCancel}>
              Cancel
            </button>{" "}
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
} 