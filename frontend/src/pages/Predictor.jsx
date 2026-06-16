import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Predictor() {
  const [marks, setMarks] = useState("");
  const [rank, setRank] = useState("");
  const [category, setCategory] = useState("General");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    if (!marks && !rank) {
      setError("Enter your NEET marks or rank.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/predictor", {
        marks: marks ? Number(marks) : undefined,
        rank: rank ? Number(rank) : undefined,
        category,
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section">
      <h2>Free NEET College Predictor</h2>
      <p className="muted" style={{ marginBottom: 18 }}>
        Enter your NEET score and/or rank to see which colleges you may get. This
        tool is 100% free. Full college details require a purchase.
      </p>

      <form className="card" onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
        <div className="toolbar" style={{ marginBottom: 0 }}>
          <div>
            <label>NEET Marks (0–720)</label>
            <input
              type="number"
              min="0"
              max="720"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="e.g. 540"
            />
          </div>
          <div>
            <label>NEET Rank (optional)</label>
            <input
              type="number"
              min="1"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              placeholder="e.g. 25000"
            />
          </div>
          <div>
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
            </select>
          </div>
        </div>
        {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}
        <button className="btn" style={{ marginTop: 14 }} disabled={loading}>
          {loading ? "Predicting..." : "Predict Colleges"}
        </button>
      </form>

      {result && (
        <div className="card">
          <p className="muted">
            Estimated rank: <strong>{result.estimatedRank}</strong> · Category:{" "}
            <strong>{result.category}</strong> · {result.count} colleges found
          </p>
          {result.colleges.length === 0 ? (
            <p style={{ marginTop: 12 }}>
              No colleges matched. Try a different rank/category.
            </p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: 12 }}>
              <table>
                <thead>
                  <tr>
                    <th>College</th>
                    <th>City</th>
                    <th>Type</th>
                    <th>Closing Rank</th>
                    <th>Chance</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {result.colleges.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>{c.city}</td>
                      <td>{c.type}</td>
                      <td>{c.closingRank}</td>
                      <td>
                        <span className={`badge ${c.chance.toLowerCase()}`}>
                          {c.chance}
                        </span>
                      </td>
                      <td>
                        <Link to={`/colleges/${c._id}`}>Details</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
