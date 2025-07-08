import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notiActions } from "../store/notification";
import { debounce } from "lodash";
import { handleApiError, ValidationErrors } from "../utils/apiErrorHandler";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface UsersResponse {
  data: User[];
  meta: {
    current_page: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
  };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationLinks, setPaginationLinks] = useState<PaginationLink[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [fromUser, setFromUser] = useState(0);
  const [toUser, setToUser] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<ValidationErrors | null>(null);

  const dispatch = useDispatch();

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosClient.get<UsersResponse>("/users", {
        params: {
          page,
          search: searchQuery,
        },
      });

      setUsers(response.data.data);
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

  const handlePageChange = (url: string | null) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };

  const onDelete = async (user: User) => {
    if (!window.confirm(`Are you sure you want to delete [${user.name}]?`)) {
      return;
    }

    setErrors(null);

    try {
      await axiosClient.delete(`/users/${user.id}`);
      dispatch(notiActions.settingNotiMessage("User was successfully deleted"));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
      fetchUsers(1);
    } catch (err) {
      console.log(err);
      setErrors(handleApiError(err));
      setTimeout(() => setErrors(null), 3000);
    }
  };

  const handleSearchChange = debounce((value: string) => {
    setSearchQuery(value);
  }, 1100);

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
            setCurrentPage(1);
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
              <th>Role</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={"/users/" + user.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      onClick={() => onDelete(user)}
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