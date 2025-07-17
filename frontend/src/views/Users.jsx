import { useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { useUsers, useDeleteUser } from "../hooks/queries/useUsers";

export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  
  const { 
    data: usersData,
    isLoading
  } = useUsers(currentPage, searchQuery);

  const deleteUserMutation = useDeleteUser();

  const handlePageChange = (url) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };

  // Wrapping search query update in debounce
  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on new search
  }, 1100);

  const onDelete = async (u) => {
    if (!window.confirm(`Are you sure you want to delete [${u.name}]?`)) {
      return;
    }

    try {
      setError(null);
      await deleteUserMutation.mutateAsync(u.id);
    } catch (err) {
      //console.error("Failed to delete user:", err.general[0]);
      setError(err.general[0]);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Users</h1>
        <Link to="/users/new" className="btn-add">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <div className="search-box">
          <input
            placeholder="Type to search users..."
            onInput={ev => handleSearchChange(ev.target.value)}
            className="search-filter-field"
          />
        </div>

        {isLoading && <div className="text-center">Loading...</div>}
        
        {error && (
          <div className="alert">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Create Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            {usersData && (
              <tbody>
                {usersData.data.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.created_at}</td>
                    <td>
                      <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                      &nbsp;
                      <button onClick={ev => onDelete(u)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}

        {/* Pagination */}
        {usersData && (
          <div className="pagination-info">
            Showing {usersData.meta.from} to {usersData.meta.to} of {usersData.meta.total} users
          </div>
        )}
        {usersData && usersData.meta.links && (
          <div className="pagination-container">
            {usersData.meta.links.map((link, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(link.url)}
                className={`btn-pagination ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
                disabled={!link.url}
                dangerouslySetInnerHTML={{__html: link.label}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
