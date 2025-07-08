import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";

export default function UsersSelectorTable({
  selectedUserIds,
  setSelectedUserIds,
}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0); // State to hold the total number of users
  const [fromUser, setFromUser] = useState(0); // Starting user number on the current page
  const [toUser, setToUser] = useState(0); // Ending user number on the current page
  //const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState(null);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axiosClient.get("/users", {
        params: { page, search: "" },
      });

      setUsers(response.data.data);
      setPaginationLinks(response.data.meta.links);
      setCurrentPage(response.data.meta.current_page);
      setTotalUsers(response.data.meta.total);
      setFromUser(response.data.meta.from);
      setToUser(response.data.meta.to);

      setLoading(false);
    } catch (err) {
      setErrors(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

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

  return (
    <div>
      <h3>Assign Users</h3>
      <div className="card animated fadeInDown">
        {/* <input
        type="text"
        placeholder="Search Users"
        onChange={(e) => {
          //setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      /> */}

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUserIds.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination-container">
          <div>
            Showing {fromUser} to {toUser} of {totalUsers} users
          </div>
          <div className="pagination">
            {(Array.isArray(paginationLinks) ? paginationLinks : []).map(
              (link, index) => (
                <button
                  type="button" // Prevent unintended form submission
                  key={index}
                  onClick={() => handlePageChange(link.url)}
                  disabled={!link.url || link.active}
                  style={{
                    margin: "0 5px",
                    fontWeight: link.active ? "bold" : "normal",
                  }}
                >
                  {link.label.replace(/&laquo;|&raquo;/g, "")}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
