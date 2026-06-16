import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { loadRazorpay } from "../services/razorpay";

export default function Colleges() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [filters, setFilters] = useState({ states: [], types: [] });
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await api.get("/colleges", {
        params: { search, state, type },
      });
      setColleges(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/colleges/meta/filters").then((res) => setFilters(res.data));
  }, []);

  useEffect(() => {
    fetchColleges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, state, type]);

  // Buy the full 600rs package.
  const buyPackage = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/colleges" } });
      return;
    }
    setBuying(true);
    setMsg("");
    try {
      const { data } = await api.post("/payment/create-order", {
        type: "package",
      });

      // DEMO MODE: backend has no Razorpay keys -> auto-verify.
      if (data.demo) {
        await api.post("/payment/verify", {
          demo: true,
          paymentRecordId: data.paymentRecordId,
        });
        await refreshUser();
        setMsg("✅ Full package unlocked (demo mode).");
        return;
      }

      // REAL MODE: open Razorpay checkout.
      const ok = await loadRazorpay();
      if (!ok) {
        setMsg("Failed to load payment gateway.");
        return;
      }
      const rzp = new window.Razorpay({
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "NEET College Portal",
        description: "Full package – all colleges",
        order_id: data.orderId,
        handler: async (response) => {
          await api.post("/payment/verify", {
            ...response,
            paymentRecordId: data.paymentRecordId,
          });
          await refreshUser();
          setMsg("✅ Full package unlocked!");
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#1e6f5c" },
      });
      rzp.open();
    } catch (err) {
      setMsg(err.response?.data?.message || "Payment failed");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="container section">
      <h2>All Colleges (40)</h2>

      {!user?.hasFullPackage && (
        <div className="card" style={{ marginBottom: 18 }}>
          <strong>Unlock everything</strong>
          <p className="muted">
            Get full details of all 40 colleges for just ₹600.
          </p>
          <button className="btn btn-accent" onClick={buyPackage} disabled={buying}>
            {buying ? "Processing..." : "Buy Full Package – ₹600"}
          </button>
          {msg && <p className="success" style={{ marginTop: 8 }}>{msg}</p>}
        </div>
      )}
      {user?.hasFullPackage && (
        <div className="card" style={{ marginBottom: 18 }}>
          <span className="badge high">Full Access</span> You can view full
          details of all colleges.
        </div>
      )}

      <div className="toolbar">
        <input
          placeholder="Search college name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={state} onChange={(e) => setState(e.target.value)}>
          <option value="">All States</option>
          {filters.states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All Types</option>
          {filters.types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid">
          {colleges.map((c) => (
            <div className="card" key={c._id}>
              <span className="badge">#{c.nirfRank} NIRF</span>
              <span className="badge">{c.type}</span>
              <h3 style={{ marginTop: 8 }}>{c.name}</h3>
              <p className="muted">
                {c.city}, {c.state}
              </p>
              <p style={{ margin: "8px 0" }}>{c.shortDescription}</p>
              <p className="muted">
                Seats: {c.totalSeats} · {c.courseOffered}
              </p>
              <Link
                to={`/colleges/${c._id}`}
                className="btn"
                style={{ marginTop: 10 }}
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
