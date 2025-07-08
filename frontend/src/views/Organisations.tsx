import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { notiActions } from "../store/notification";
import { debounce } from "lodash";
import { handleApiError, ValidationErrors } from "../utils/apiErrorHandler";

interface Organisation {
  id: number;
  name: string;
  created_at: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface OrganisationsResponse {
  data: Organisation[];
  meta: {
    current_page: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
  };
}

interface DeleteResponse {
  message?: string;
}

export default function Organisations() {
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationLinks, setPaginationLinks] = useState<PaginationLink[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrganisations, setTotalOrganisations] = useState(0);
  const [fromOrganisation, setFromOrganisation] = useState(0);
  const [toOrganisation, setToOrganisation] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState<ValidationErrors | null>(null);

  const dispatch = useDispatch();

  const fetchOrganisations = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axiosClient.get<OrganisationsResponse>("/organisations", {
        params: {
          page,
          search: searchQuery,
        },
      });

      setOrganisations(response.data.data);
      setPaginationLinks(response.data.meta.links);
      setCurrentPage(response.data.meta.current_page);
      setTotalOrganisations(response.data.meta.total);
      setFromOrganisation(response.data.meta.from);
      setToOrganisation(response.data.meta.to);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching organisations:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganisations(currentPage);
  }, [currentPage, searchQuery]);

  const handlePageChange = (url: string | null) => {
    if (url) {
      const page = new URL(url).searchParams.get("page");
      setCurrentPage(Number(page));
    }
  };

  const onDelete = async (org: Organisation) => {
    if (!window.confirm(`Are you sure you want to delete [${org.name}]?`)) {
      return;
    }

    setErrors(null);

    try {
      const response = await axiosClient.delete<DeleteResponse>(`/organisations/${org.id}`);
      const message = response.data?.message || "Organisation was deleted successfully";

      dispatch(notiActions.settingNotiMessage(message));
      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);

      fetchOrganisations(1);
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
        <h1>Organisations</h1>
        <Link to="/organisations/new" className="btn-add">
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
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {organisations.map((org) => (
                <tr key={org.id}>
                  <td>{org.id}</td>
                  <td>{org.name}</td>
                  <td>{org.created_at}</td>
                  <td>
                    <Link className="btn-edit" to={"/organisations/" + org.id}>
                      Edit
                    </Link>
                    &nbsp;
                    <button
                      onClick={() => onDelete(org)}
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
            Showing {fromOrganisation} to {toOrganisation} of{" "}
            {totalOrganisations} organisations
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