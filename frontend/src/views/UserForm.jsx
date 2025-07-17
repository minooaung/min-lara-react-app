import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser, useCreateUser, useUpdateUser } from "../hooks/queries/useUsers";
import { useSelector } from "react-redux";

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const reduxUser = useSelector((state) => state.auth.user);

  const [user, setUser] = useState({
    id: null,
    name: "",
    email: "",
    role: "",
    password: "",
    password_confirmation: "",
  });

  // Fetch user data if editing
  const { 
    data: userData,
    isLoading: isLoadingUser,
    error: userError,
    refetch: refetchUser
  } = useUser(id);

  // Create and update mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Update state when user data changes
  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        password: "", // Don't populate password fields
        password_confirmation: "",
      });
    }
  }, [userData]);

  // Effect to refetch data when id changes
  useEffect(() => {
    if (id) {
      refetchUser();
    }
  }, [id, refetchUser]);

  const onSubmit = async (ev) => {
    ev.preventDefault();

    try {
      if (user.id) {
        // For update, only include password if it's provided
        const updateData = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.password ? {
            password: user.password,
            password_confirmation: user.password_confirmation
          } : {})
        };
        
        const response = await updateUserMutation.mutateAsync(updateData);
        
        // Update Redux store if the updated user is the logged-in user
        if (reduxUser && reduxUser.id === user.id) {
          // The mutation hook will handle the Redux update
          console.log("Updated logged-in user:", response);
        }

        // Force a refetch after update
        await refetchUser();
      } else {
        await createUserMutation.mutateAsync(user);
      }
      navigate("/users");
    } catch (err) {
      // Error handling is done in the mutation hooks
      console.error("Failed to save user:", err);
    }
  };

  const onCancel = () => navigate("/users");

  return (
    <>
      {id ? (
        <h1>Edit{user.name ? ` : ${user.name}` : ""}</h1>
      ) : (
        <h1>New User</h1>
      )}

      <div className="card animated fadeInDown">
        {isLoadingUser && <div className="text-center">Loading...</div>}

        {userError && (
          <div className="alert">
            {Object.keys(userError).map((key) => (
              <p key={key}>{userError[key][0]}</p>
            ))}
          </div>
        )}

        {(createUserMutation.error || updateUserMutation.error) && (
          <div className="alert">
            {Object.keys(createUserMutation.error || updateUserMutation.error).map((key) => (
              <p key={key}>{(createUserMutation.error || updateUserMutation.error)[key][0]}</p>
            ))}
          </div>
        )}

        {!isLoadingUser && (
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={(ev) =>
                setUser({ ...user, name: ev.target.value })
              }
              placeholder="Name"
              required={!user.id}
              autoComplete="name"
            />
            <input
              value={user.email}
              onChange={(ev) =>
                setUser({ ...user, email: ev.target.value })
              }
              placeholder="Email"
              type="email"
              required={!user.id}
              autoComplete="username"
            />
            <select
              value={user.role}
              onChange={(ev) =>
                setUser({ ...user, role: ev.target.value })
              }
              required={!user.id}
              disabled={user.id}
            >
              <option value="" disabled>Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="EMPLOYEE">Employee</option>
            </select>
            <input
              type="password"
              onChange={(ev) =>
                setUser({ ...user, password: ev.target.value })
              }
              placeholder={user.id ? "Leave empty to keep current password" : "Password"}
              required={!user.id}
              autoComplete="new-password"
            />
            <input
              type="password"
              onChange={(ev) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
              placeholder={user.id ? "Leave empty to keep current password" : "Password Confirmation"}
              required={!user.id}
              autoComplete="new-password"
            />
            <button 
              type="button" 
              className="btn" 
              onClick={onCancel}
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              Cancel
            </button>
            {" "}
            <button 
              type="submit"
              className="btn"
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
