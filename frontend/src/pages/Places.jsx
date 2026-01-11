import { useEffect, useState } from "react";
import API from "../api/api";

export default function Places() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    API.get("/places").then((res) => setPlaces(res.data));
  }, []);

  const createPlace = async () => {
    await API.post("/places", {
      title: "Goa Beach",
      description: "Beautiful beach",
      location: "Goa",
      category: "Beach",
    });

    alert("Place created");

    // refresh list
    const res = await API.get("/places");
    setPlaces(res.data);
  };

  return (
    <div>
      <h2>Places</h2>

      <button onClick={createPlace}>
        Add Place
      </button>

      {places.map((p) => (
        <div key={p.id}>
          <h3>{p.title}</h3>
          <p>{p.location}</p>
        </div>
      ))}
    </div>
  );
}
