import { useEffect, useState } from "react";

function Recommendations() {
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/recommend/1")
      .then((res) => res.json())
      .then((data) => setRecommendation(data));
  }, []);

  if (!recommendation) return <p>Loading...</p>;

  return (
    <div>
      <h2>Recommended Place</h2>

      <p>
        <strong>Place:</strong> {recommendation.place}
      </p>
      <p>
        <strong>Reason:</strong> {recommendation.reason}
      </p>
    </div>
  );
}

export default Recommendations;
