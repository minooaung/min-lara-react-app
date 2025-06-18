import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";

// import { useStateContext } from "../contexts/ContextProvider";

import { useDispatch } from "react-redux";
import { notiActions } from "../store/notification";

import { debounce } from "lodash"; // Run > npm install lodash

import { handleApiError } from "../utils/apiErrorHandler";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Via Context API
  // const { setNotification } = useStateContext();

  const dispatch = useDispatch();

  //-----------------
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  //const [lastPage, setLastPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0); // State to hold the total number of users
  const [fromUser, setFromUser] = useState(0); // Starting user number on the current page
  const [toUser, setToUser] = useState(0); // Ending user number on the current page
  const [searchQuery, setSearchQuery] = useState("");

  const [errors, setErrors] = useState(null);

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/users", {
        params: {
          page,
          search: searchQuery,
        },
      });

      setUsers(response.data.data);

      //   setPaginationLinks(response.data.links);
      //   setCurrentPage(response.data.current_page);
      ////setLastPage(response.data.last_page);
      //   setTotalUsers(response.data.total);
      //   setFromUser(response.data.from);
      //   setToUser(response.data.to);

      setPaginationLinks(response.data.meta.links);
      setCurrentPage(response.data.meta.current_page);
      setTotalUsers(response.data.meta.total);
      setFromUser(response.data.meta.from);
      setToUser(response.data.meta.to);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, searchQuery]);

  const handlePageChange = (url) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };
  //-----------------

  const onDelete = async (u) => {
    if (!window.confirm(`Are you sure you want to delete [${u.name}]?`)) {
      return;
    }

    try {
      await axiosClient.delete(`/users/${u.id}`);

      dispatch(notiActions.settingNotiMessage("User was successfully deleted"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);

      fetchUsers(1); // Refresh user list after deletion
    } catch (err) {
      console.log(err);
      setErrors(handleApiError(err));

      // Auto-clear errors after 3 seconds
      setTimeout(() => setErrors(null), 3000);
    }
  };

  // Wrapping search query update in debounce
  // For search filter of Users Register
  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
  }, 1100); // Delay API call by 1000ms

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Users</h1>
        <Link to="/users/new" className="btn-add">
          Add new
        </Link>
      </div>
      <div className="card animated fadeInDown">
        <input
          type="text"
          className="search-filter-field"
          placeholder="Search"
          onChange={(e) => {
            handleSearchChange(e.target.value);
            setCurrentPage(1); // Reset page when user searches
          }}
        />

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
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={"/users/" + u.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      onClick={(ev) => onDelete(u)}
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        <div className="pagination-container">
          <div>
            Showing {fromUser} to {toUser} of {totalUsers} users
          </div>
          <div className="pagination">
            {(Array.isArray(paginationLinks) ? paginationLinks : []).map(
              (link, index) => (
                <button
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
