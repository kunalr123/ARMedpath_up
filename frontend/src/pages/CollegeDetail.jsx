import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { loadRazorpay } from "../services/razorpay";
import useScreenshotGuard from "../hooks/useScreenshotGuard";

export default function CollegeDetail() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);
  const [msg, setMsg] = useState("");

  const fetchCollege = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/colleges/${id}`);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollege();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const locked = data?.locked;
  // Turn the screenshot guard ON only when unlocked content is shown.
  useScreenshotGuard(!locked && !!data);

  // Buy this single college for 65rs.
  const buySingle = async () => {
    setBuying(true);
    setMsg("");
    try {
      const { data: order } = await api.post("/payment/create-order", {
        type: "single",
        collegeId: id,
      });

      // DEMO MODE
      if (order.demo) {
        await api.post("/payment/verify", {
          demo: true,
          paymentRecordId: order.paymentRecordId,
        });
        await refreshUser();
        await fetchCollege();
        setMsg("✅ Unlocked (demo mode).");
        return;
      }

      // REAL MODE
      const ok = await loadRazorpay();
      if (!ok) {
        setMsg("Failed to load payment gateway.");
        return;
      }
      const rzp = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "NEET College Portal",
        description: "Single college details",
        order_id: order.orderId,
        handler: async (response) => {
          await api.post("/payment/verify", {
            ...response,
            paymentRecordId: order.paymentRecordId,
          });
          await refreshUser();
          await fetchCollege();
          setMsg("✅ Unlocked!");
        },
        prefill: { name: user?.name, email: user?.email },
        theme: { color: "#1e6f5c" },
      });
      rzp.open();
    } catch (err) {
      setMsg(err.response?.data?.message || "Payment failed");
    } finally {
      setBuying(false);
    }
  };

  if (loading) return <div className="container section">Loading...</div>;
  if (!data) return <div className="container section">College not found.</div>;

  const c = data.college;

  return (
    <div className="container section">
      <span className="badge">#{c.nirfRank} NIRF</span>
      <span className="badge">{c.type}</span>
      <h2 style={{ marginTop: 8 }}>{c.name}</h2>
      <p className="muted">
        {c.city}, {c.state} · Est. {c.established}
      </p>
      <p style={{ margin: "10px 0" }}>{c.shortDescription}</p>

      <div className="card" style={{ marginTop: 12 }}>
        <div className="detail-row">
          <span>Course</span>
          <span>{c.courseOffered}</span>
        </div>
        <div className="detail-row">
          <span>Total Seats</span>
          <span>{c.totalSeats}</span>
        </div>
      </div>

      {locked ? (
        <div className="lock-box">
          <h3>🔒 Full details are locked</h3>
          <p className="muted" style={{ margin: "8px 0 16px" }}>
            Unlock fees, cutoffs, facilities, placements and contact details for
            this college.
          </p>
          <button className="btn btn-accent" onClick={buySingle} disabled={buying}>
            {buying ? "Processing..." : "Unlock this college – ₹65"}
          </button>
          {msg && <p className="success" style={{ marginTop: 10 }}>{msg}</p>}
          <p className="muted" style={{ marginTop: 14, fontSize: "0.85rem" }}>
            Tip: Buy the ₹600 full package from the Colleges page to unlock all 40
            colleges.
          </p>
        </div>
      ) : (
        // ---- PAID CONTENT: protected against screenshots ----
        <div className="protected no-select" style={{ marginTop: 18 }}>
          <div className="card">
            <h3>Full Details</h3>
            <p style={{ margin: "10px 0" }}>{c.fullDescription}</p>

            <div className="detail-row">
              <span>Annual Fees</span>
              <span>{c.annualFees}</span>
            </div>
            <div className="detail-row">
              <span>Hostel Fees</span>
              <span>{c.hostelFees}</span>
            </div>
            <div className="detail-row">
              <span>Closing Rank (General)</span>
              <span>{c.cutoffGeneral}</span>
            </div>
            <div className="detail-row">
              <span>Closing Rank (OBC)</span>
              <span>{c.cutoffOBC}</span>
            </div>
            <div className="detail-row">
              <span>Closing Rank (SC)</span>
              <span>{c.cutoffSC}</span>
            </div>
            <div className="detail-row">
              <span>Closing Rank (ST)</span>
              <span>{c.cutoffST}</span>
            </div>
            <div className="detail-row">
              <span>Placements</span>
              <span style={{ textAlign: "right", maxWidth: "60%" }}>
                {c.placementInfo}
              </span>
            </div>
            <div className="detail-row">
              <span>Address</span>
              <span style={{ textAlign: "right", maxWidth: "60%" }}>
                {c.address}
              </span>
            </div>
            <div className="detail-row">
              <span>Website</span>
              <span>{c.website}</span>
            </div>
            <div className="detail-row">
              <span>Phone</span>
              <span>{c.contactPhone}</span>
            </div>
            <div className="detail-row">
              <span>Email</span>
              <span>{c.contactEmail}</span>
            </div>

            <div style={{ marginTop: 12 }}>
              <strong>Facilities</strong>
              <div style={{ marginTop: 6 }}>
                {(c.facilities || []).map((f) => (
                  <span className="badge" key={f}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 10, fontSize: "0.8rem" }}>
            🔒 This content is protected. Screenshots and copying are disabled.
          </p>
        </div>
      )}
    </div>
  );
}
