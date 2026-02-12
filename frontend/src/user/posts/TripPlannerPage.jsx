import { useState } from "react";
import API from "../../api/api";
import "./post.css";

export default function TripPlannerPage() {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [style, setStyle] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination.trim()) return;
    try {
      setLoading(true);
      setPlan(null);
      const res = await API.post("/trip-plan", {
        destination: destination.trim(),
        days: Number(days) || 1,
        style: style || null,
      });
      setPlan(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to create trip plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-planner-page">
      <div className="feed-header">
        <h2>Trip Advisor</h2>
        <p>
          A smaller, smart version of TripAdvisor / MakeMyTrip that builds a
          simple itinerary from the trips you like and save.
        </p>
      </div>

      <form className="trip-form" onSubmit={handleSubmit}>
        <div className="trip-form-row">
          <div className="trip-field">
            <label>Destination</label>
            <input
              type="text"
              placeholder="e.g. Bali, Goa, Paris"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="trip-field">
            <label>Days</label>
            <input
              type="number"
              min={1}
              max={7}
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
          <div className="trip-field">
            <label>Trip style (optional)</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              <option value="">Anything</option>
              <option value="relaxed">Relaxed</option>
              <option value="adventure">Adventure</option>
              <option value="cultural">Cultural</option>
            </select>
          </div>
        </div>
        <button className="trip-submit" type="submit" disabled={loading}>
          {loading ? "Creating plan..." : "Make my trip"}
        </button>
      </form>

      {plan && (
        <div className="trip-plan">
          <h3>
            {plan.days}-day plan for {plan.destination}
          </h3>
          <div className="trip-days-grid">
            {plan.days_plan.map((day) => (
              <div key={day.day} className="trip-day-card">
                <h4>{day.summary}</h4>
                <ul>
                  {day.activities.map((act, idx) => (
                    <li key={idx}>
                      <strong>{act.title}</strong>
                      <p>{act.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
