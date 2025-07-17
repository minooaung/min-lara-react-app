import { useState } from "react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import { useOrganisations, useDeleteOrganisation } from "../hooks/queries/useOrganisations";

export default function Organisations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  
  const { 
    data: organisationsData,
    isLoading
  } = useOrganisations(currentPage, searchQuery);

  const deleteOrganisationMutation = useDeleteOrganisation();

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

  const onDelete = async (org) => {
    if (!window.confirm(`Are you sure you want to delete [${org.name}]?`)) {
      return;
    }

    try {
      setError(null);
      await deleteOrganisationMutation.mutateAsync(org.id);
    } catch (err) {
      console.error("Failed to delete organisation:", err.general[0]);
      setError(err.general[0]);
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Organisations</h1>
        <Link to="/organisations/new" className="btn-add">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <div className="search-box">
          <input
            placeholder="Type to search organisations..."
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
                <th>Users Count</th>
                <th>Create Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            {organisationsData && (
              <tbody>
                {organisationsData.data.map(org => (
                  <tr key={org.id}>
                    <td>{org.id}</td>
                    <td>{org.name}</td>
                    <td>{org.users_count}</td>
                    <td>{org.created_at}</td>
                    <td>
                      <Link className="btn-edit" to={'/organisations/' + org.id}>Edit</Link>
                      &nbsp;
                      <button onClick={ev => onDelete(org)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        )}

        {/* Pagination */}
        {organisationsData && (
          <div className="pagination-info">
            Showing {organisationsData.meta.from} to {organisationsData.meta.to} of {organisationsData.meta.total} organisations
          </div>
        )}
        {organisationsData && organisationsData.meta.links && (
          <div className="pagination-container">
            {organisationsData.meta.links.map((link, index) => (
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
