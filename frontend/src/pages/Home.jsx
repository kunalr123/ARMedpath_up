import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Find Your Right NEET College</h1>
          <p>
            Predict colleges based on your NEET marks &amp; rank for free. Unlock
            full details of any college for ₹65, or get all 40 colleges with our
            ₹600 package.
          </p>
          <div className="actions">
            <Link to="/predictor" className="btn btn-accent">
              Predict Colleges (Free)
            </Link>
            <Link to="/colleges" className="btn btn-outline">
              Browse Colleges
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid">
            <div className="card">
              <h3>🎯 Free College Predictor</h3>
              <p className="muted">
                Enter your NEET marks and rank to instantly see which colleges
                you may get. Completely free, no login needed.
              </p>
            </div>
            <div className="card">
              <h3>🔓 Single College – ₹65</h3>
              <p className="muted">
                Unlock complete details of any single college: fees, cutoffs,
                facilities, placements and contact info.
              </p>
            </div>
            <div className="card">
              <h3>📦 Full Package – ₹600</h3>
              <p className="muted">
                Unlock full details of all 40 colleges at once and save big.
                One payment, lifetime access on your account.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>How it works</h2>
          <div className="grid">
            <div className="card">
              <strong>1. Create an account</strong>
              <p className="muted">Sign up free to track your unlocked colleges.</p>
            </div>
            <div className="card">
              <strong>2. Predict or browse</strong>
              <p className="muted">Use the free predictor or browse all colleges.</p>
            </div>
            <div className="card">
              <strong>3. Pay &amp; unlock</strong>
              <p className="muted">Pay ₹65 per college or ₹600 for everything.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
