import { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function AddPlace() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const submit = async () => {
    await API.post("/admin/places", form);
    navigate("/admin/places");
  };

  return (
    <>
      <h2>Add Place</h2>
      <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Country" onChange={e => setForm({ ...form, country: e.target.value })} />
      <input placeholder="Category" onChange={e => setForm({ ...form, category: e.target.value })} />
      <button onClick={submit}>Save</button>
    </>
  );
}
