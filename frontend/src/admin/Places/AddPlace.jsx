import { useState } from "react";
import API from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../admin.css";

export default function AddPlace() {
  const [form, setForm] = useState({
    name: "",
    country: "",
    category: "",
  });

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/admin/places", form);
    navigate("/admin/places");
  };

  return (
    <div className="admin-card" style={{ maxWidth: "500px" }}>
      <h2>Add Place</h2>

      <form className="auth-form" onSubmit={submit}>
        <div>
          <label>Name</label>
          <input
            placeholder="Place name"
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
            placeholder="Country"
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
            placeholder="Category (Beach, City, Hill...)"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            required
          />
        </div>

        <button className="admin-button" type="submit">
          Save Place
        </button>
      </form>
    </div>
  );
}
