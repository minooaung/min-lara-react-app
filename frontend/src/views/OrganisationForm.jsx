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
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          {id ? `Edit Organisation${organisation.name ? `: ${organisation.name}` : ""}` : "New Organisation"}
        </h1>
      </div>

      {isLoadingOrg && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {(orgError || createOrganisationMutation.error || updateOrganisationMutation.error) && (
        <div className="rounded-md bg-red-100 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              {orgError && Object.keys(orgError).map((key) => (
                <p key={key} className="text-sm font-medium text-red-800">{orgError[key][0]}</p>
              ))}
              {(createOrganisationMutation.error || updateOrganisationMutation.error) && 
                Object.keys(createOrganisationMutation.error || updateOrganisationMutation.error).map((key) => (
                  <p key={key} className="text-sm font-medium text-red-800">
                    {(createOrganisationMutation.error || updateOrganisationMutation.error)[key][0]}
                  </p>
                ))
              }
            </div>
          </div>
        </div>
      )}

      {!isLoadingOrg && (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Organisation Name</label>
              <input
                id="name"
                value={organisation.name}
                onChange={(ev) => setOrganisation({ ...organisation, name: ev.target.value })}
                placeholder="Enter organisation name"
                required={!organisation.id}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="space-y-2">              
              <div className="mt-1">
                <UsersSelectorTable
                  selectedUserIds={selectedUserIds}
                  setSelectedUserIds={setSelectedUserIds}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button" 
                onClick={onCancel}
                disabled={createOrganisationMutation.isPending || updateOrganisationMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={createOrganisationMutation.isPending || updateOrganisationMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {createOrganisationMutation.isPending || updateOrganisationMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
