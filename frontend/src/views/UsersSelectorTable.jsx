import { useState, useEffect } from "react";
import { useUsers, useSelectedUsers } from "../hooks/queries/useUsers";

export default function UsersSelectorTable({
  selectedUserIds,
  setSelectedUserIds,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [allUsers, setAllUsers] = useState(new Map()); // Use Map for efficient lookups
  
  // Fetch paginated users for the table
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError
  } = useUsers(currentPage, "");

  // Fetch all selected users' data
  const {
    data: selectedUsersData,
    isLoading: isLoadingSelected
  } = useSelectedUsers(selectedUserIds);

  // Update allUsers Map when new data comes in
  useEffect(() => {
    if (usersData?.data) {
      setAllUsers(prevUsers => {
        const newUsers = new Map(prevUsers);
        usersData.data.forEach(user => {
          newUsers.set(user.id, user);
        });
        return newUsers;
      });
    }
  }, [usersData]);

  // Add selected users to allUsers Map
  useEffect(() => {
    if (selectedUsersData) {
      setAllUsers(prevUsers => {
        const newUsers = new Map(prevUsers);
        selectedUsersData.forEach(user => {
          newUsers.set(user.id, user);
        });
        return newUsers;
      });
    }
  }, [selectedUsersData]);

  const handlePageChange = (url) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((uid) => uid !== id)
        : [...prevIds, id]
    );
  };

  // Get user data by ID from allUsers Map
  const getUserById = (id) => allUsers.get(id);

  return (
    <div className="user-selector">
      <h3>Select Users</h3>
      
      {usersError && (
        <div className="alert">
          {Object.keys(usersError).map((key) => (
            <p key={key}>{usersError[key][0]}</p>
          ))}
        </div>
      )}

      {/* Show selected users summary */}
      {selectedUserIds.length > 0 && (
        <div className="selected-users-summary">
          <h4>Selected Users ({selectedUserIds.length})</h4>
          <div className="selected-users-list">
            {selectedUserIds.map(id => {
              const user = getUserById(id);
              if (!user) return null;
              return (
                <div key={id} className="selected-user-chip">
                  {user.name}
                  <button 
                    onClick={() => toggleUserSelection(id)}
                    className="remove-selected"
                    title="Remove user"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!isLoadingUsers && usersData && (
        <>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {usersData.data.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-info">
            Showing {usersData.meta.from} to {usersData.meta.to} of {usersData.meta.total} users
            {selectedUserIds.length > 0 && ` (${selectedUserIds.length} selected)`}
          </div>
          <div className="pagination-container">
            {usersData.meta.links.map((link, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  if (link.url) {
                    handlePageChange(link.url);
                  }
                }}
                className={`btn-pagination ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                disabled={!link.url}
              >
                {link.label === "&laquo; Previous" ? "← Previous" : 
                 link.label === "Next &raquo;" ? "Next →" : 
                 link.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
