import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";
import "../admin.css";


export default function EditPlace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    country: "",
    category: "",
  });

  useEffect(() => {
    API.get(`/places/${id}`).then((res) => {
      setForm(res.data);
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    await API.put(`/admin/places/${id}`, form);
    navigate("/admin/places");
  };

  return (
    <div className="admin-card" style={{ maxWidth: "500px" }}>
      <h2>Edit Place</h2>

      <form className="auth-form" onSubmit={submit}>
        <div>
          <label>Name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Country</label>
          <input
            value={form.country}
            onChange={(e) =>
              setForm({ ...form, country: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Category</label>
          <input
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            required
          />
        </div>

        <button className="admin-button" type="submit">
          Update Place
        </button>
      </form>
    </div>
  );
}
