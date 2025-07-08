import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { handleApiError, ValidationErrors } from "../utils/apiErrorHandler";
import { useDispatch } from "react-redux";
import { notiActions } from "../store/notification";
import UsersSelectorTable from "./UsersSelectorTable";

interface Organisation {
  id: number | null;
  name: string;
  users?: Array<{ id: number; name: string; }>;
}

interface OrganisationFormData extends Organisation {
  user_ids?: number[];
}

export default function OrganisationForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [organisation, setOrganisation] = useState<Organisation>({
    id: null,
    name: "",
  });

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  useEffect(() => {
    if (!id) return;

    setErrors(null);

    const fetchOrg = async () => {
      setLoading(true);

      try {
        const { data } = await axiosClient.get<Organisation>(`/organisations/${id}`);
        console.log("Fetched Organisation Data:", data);
        setOrganisation(data);
        setSelectedUserIds(data.users?.map(u => u.id) || []);
      } catch (err) {
        setErrors(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrg();
  }, [id]);

  const onSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setErrors(null);

    const payload: OrganisationFormData = {
      ...organisation,
      user_ids: selectedUserIds,
    };

    try {
      if (organisation.id) {
        await axiosClient.put(`/organisations/${organisation.id}`, payload);
        dispatch(
          notiActions.settingNotiMessage("Organisation updated successfully")
        );
      } else {
        await axiosClient.post("/organisations", payload);
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

  const onCancel = (ev: React.MouseEvent<HTMLButtonElement>) => {
    ev.preventDefault();
    navigate("/organisations");
  };

  return (
    <>
      <h1>
        {organisation.id ? "Edit" : "New Organisation"}
      </h1>
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
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setOrganisation({ ...organisation, name: ev.target.value })
              }
              placeholder="Organisation Name"
            />
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