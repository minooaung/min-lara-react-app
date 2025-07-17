import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UsersSelectorTable from "./UsersSelectorTable";
import { useOrganisation, useCreateOrganisation, useUpdateOrganisation } from "../hooks/queries/useOrganisations";

export default function OrganisationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [selectedUserIds, setSelectedUserIds] = useState([]); // Track selected users
  const [organisation, setOrganisation] = useState({
    id: null,
    name: "",
  });

  // Fetch organization data if editing
  const { 
    data: orgData,
    isLoading: isLoadingOrg,
    error: orgError,
    refetch: refetchOrg
  } = useOrganisation(id);

  // Create and update mutations
  const createOrganisationMutation = useCreateOrganisation();
  const updateOrganisationMutation = useUpdateOrganisation();

  // Update state when organization data changes
  useEffect(() => {
    if (orgData) {
      console.log('Organization data updated:', orgData);
      setOrganisation(orgData);
      setSelectedUserIds(orgData.users?.map(u => u.id) || []);
    }
  }, [orgData]);

  // Remove the unnecessary refetch effect

  const onSubmit = async (ev) => {
    ev.preventDefault();

    const payload = {
      ...organisation,
      user_ids: selectedUserIds,
    };

    try {
      if (organisation.id) {
        await updateOrganisationMutation.mutateAsync({
          id: organisation.id,
          ...payload
        });
      } else {
        await createOrganisationMutation.mutateAsync(payload);
      }
      navigate("/organisations");
    } catch (err) {
      console.error("Failed to save organisation:", err);
    }
  };

  const onCancel = () => navigate("/organisations");

  return (
    <>      
      {id ? (
        <h1>Edit{organisation.name ? ` : ${organisation.name}` : ""}</h1>
      ) : (
        <h1>New Organisation</h1>
      )}
      
      <div className="card animated fadeInDown">
        {isLoadingOrg && <div className="text-center">Loading...</div>}

        {orgError && (
          <div className="alert">
            {Object.keys(orgError).map((key) => (
              <p key={key}>{orgError[key][0]}</p>
            ))}
          </div>
        )}

        {(createOrganisationMutation.error || updateOrganisationMutation.error) && (
          <div className="alert">
            {Object.keys(createOrganisationMutation.error || updateOrganisationMutation.error).map((key) => (
              <p key={key}>{(createOrganisationMutation.error || updateOrganisationMutation.error)[key][0]}</p>
            ))}
          </div>
        )}

        {!isLoadingOrg && (
          <form onSubmit={onSubmit}>
            <h3>Organisation Name</h3>
            <input
              value={organisation.name}
              onChange={(ev) =>
                setOrganisation({ ...organisation, name: ev.target.value })
              }
              placeholder="Organisation Name"
              required={!organisation.id}
            />
            
            {/* User selection table */}
            <UsersSelectorTable
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
            />

            <button 
              type="button" 
              className="btn" 
              onClick={onCancel}
              disabled={createOrganisationMutation.isPending || updateOrganisationMutation.isPending}
            >
              Cancel
            </button>
            {" "}
            <button 
              type="submit" 
              className="btn"
              disabled={createOrganisationMutation.isPending || updateOrganisationMutation.isPending}
            >
              {createOrganisationMutation.isPending || updateOrganisationMutation.isPending ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
