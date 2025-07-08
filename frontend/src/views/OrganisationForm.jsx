import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { handleApiError } from "../utils/apiErrorHandler";

import { useDispatch } from "react-redux";
import { notiActions } from "../store/notification";

import UsersSelectorTable from "./UsersSelectorTable"; // 👈 Import your selector

export default function OrganisationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [organisation, setOrganisation] = useState({
    id: null,
    name: "",
  });

  const [selectedUserIds, setSelectedUserIds] = useState([]); // 👈 Track selection

  useEffect(() => {
    if (!id) return; // Prevent effect from running if `id` is falsy

    setErrors(null); // Reset errors before fetching new user data

    const fetchOrg = async () => {
      setLoading(true); // Start loading

      try {
        const { data } = await axiosClient.get(`/organisations/${id}`);
        console.log("Fetched Organisation Data:", data);
        setOrganisation(data);
        setSelectedUserIds(data.users?.map((u) => u.id) || []); // 👈 Prefill assigned users
      } catch (err) {
        setErrors(handleApiError(err));
      } finally {
        setLoading(false); // Ensure loading stops in all cases
      }
    };

    fetchOrg();
  }, [id]); // Include `id` as dependency to avoid unnecessary re-runs

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setErrors(null);

    const payload = {
      ...organisation,
      user_ids: selectedUserIds, // 👈 Include selected user IDs
    };

    try {
      if (organisation.id) {
        await axiosClient.put(`/organisations/${organisation.id}`, payload);
        dispatch(
          notiActions.settingNotiMessage("Organisation updated successfully")
        );
      } else {
        await axiosClient.post(`/organisations`, payload);
        dispatch(
          notiActions.settingNotiMessage("Organisation created successfully")
        );
      }

      setTimeout(() => dispatch(notiActions.settingNotiMessage(null)), 3000);
      navigate("/organisations");
    } catch (err) {
      setErrors(handleApiError(err));
    }
  };

  const onCancel = () => navigate("/organisations");

  return (
    <>      
      {id ? (<h1>Edit{organisation.name ? ` : ${organisation.name}` : ""}</h1>) : (<h1>New Organisation</h1>) }
      
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}

        {!loading && (
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
            {/* 👇 Embedded user selection table */}
            <UsersSelectorTable
              selectedUserIds={selectedUserIds}
              setSelectedUserIds={setSelectedUserIds}
            />
            <button className="btn" onClick={onCancel}>
              Cancel
            </button>{" "}
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
