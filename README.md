# NEET College Portal (MERN)

A full-stack website where students can:

- **Predict colleges for free** based on NEET marks & rank.
- **Unlock full details of one college for ₹65.**
- **Unlock all 40 colleges for ₹600** (full package).
- Paid pages have **best-effort screenshot/copy protection**.

Built with **MongoDB, Express, React (Vite), Node.js**. The backend and
frontend are in **separate folders** for independent deployment (Render +
Netlify) with a custom GoDaddy domain.

> Currently ships with **40 dummy colleges**. Replace them with real data in
> [`backend/data/colleges.js`](backend/data/colleges.js) and run `npm run seed`.

---

## Project structure

```
backend/    -> Express API (deploy to Render)
frontend/   -> React app   (deploy to Netlify)
PROJECT_GUIDE.txt -> full step-by-step deployment + GoDaddy + update guide
```

## Quick start (local)

**1. Backend**
```bash
cd backend
cp .env.example .env      # then fill MONGO_URI + JWT_SECRET
npm install
npm run seed              # load the 40 colleges (run once)
npm run dev               # http://localhost:5000
```

**2. Frontend** (new terminal)
```bash
cd frontend
cp .env.example .env      # set VITE_API_URL=http://localhost:5000
npm install
npm run dev               # http://localhost:5173
```

Leave the Razorpay keys empty to run in **DEMO MODE** (payments unlock
instantly without real money — perfect for testing). Add real Razorpay keys
on Render to accept real payments.

## Deployment

See **[PROJECT_GUIDE.txt](PROJECT_GUIDE.txt)** for the complete, beginner-friendly
guide covering:

1. Running locally
2. Pushing to GitHub
3. Deploying the backend to **Render**
4. Deploying the frontend to **Netlify**
5. Connecting a **GoDaddy** custom domain
6. Enabling real **Razorpay** payments
7. Updating college data later
8. Notes on screenshot protection

## Tech stack

| Layer    | Tech                         |
|----------|------------------------------|
| Frontend | React 18, Vite, React Router |
| Backend  | Node.js, Express             |
| Database | MongoDB (Mongoose)           |
| Auth     | JWT + bcrypt                 |
| Payments | Razorpay (with demo fallback)|

## Pricing (configurable)

Set in backend env vars (values in paise):

- `SINGLE_COLLEGE_PRICE=6500` → ₹65
- `FULL_PACKAGE_PRICE=60000` → ₹600

## Disclaimer

College data is for guidance only. No website can fully prevent screenshots;
the app applies strong deterrents on paid content (see PROJECT_GUIDE.txt §11).
