import { useEffect, useState } from "react";
import API from "../../api/api";
import { Link } from "react-router-dom";

export default function PlacesList() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    API.get("/places").then(res => setPlaces(res.data));
  }, []);

  return (
    <>
      <h2>Places</h2>
      <Link to="/admin/places/add">Add Place</Link>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Country</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.country}</td>
              <td>{p.category}</td>
              <td>
                <Link to={`/admin/places/edit/${p.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
