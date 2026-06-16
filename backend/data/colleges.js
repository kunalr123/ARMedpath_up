// Dummy data for 40 colleges.
// Replace / edit any of these later with your real data, then run "npm run seed".

const cities = [
  ["Delhi", "Delhi"],
  ["Mumbai", "Maharashtra"],
  ["Chennai", "Tamil Nadu"],
  ["Kolkata", "West Bengal"],
  ["Bengaluru", "Karnataka"],
  ["Hyderabad", "Telangana"],
  ["Pune", "Maharashtra"],
  ["Jaipur", "Rajasthan"],
  ["Lucknow", "Uttar Pradesh"],
  ["Bhopal", "Madhya Pradesh"],
  ["Patna", "Bihar"],
  ["Chandigarh", "Punjab"],
  ["Ahmedabad", "Gujarat"],
  ["Kochi", "Kerala"],
  ["Guwahati", "Assam"],
];

const types = ["Government", "Private", "Deemed"];
const facilitiesPool = [
  "Central Library",
  "Boys & Girls Hostel",
  "24x7 Hospital",
  "Sports Complex",
  "Research Labs",
  "Wi-Fi Campus",
  "Cafeteria",
  "Auditorium",
  "Anatomy Museum",
  "Transport",
];

// Build 40 colleges deterministically so the data is stable.
const colleges = Array.from({ length: 40 }).map((_, i) => {
  const n = i + 1;
  const [city, state] = cities[i % cities.length];
  const type = types[i % types.length];
  const baseCutoff = 1000 + i * 1500; // simple increasing closing rank

  return {
    name: `${city} Medical College ${n}`,
    city,
    state,
    type,
    established: 1950 + (i % 60),
    nirfRank: n,

    // Preview (free)
    shortDescription: `${city} Medical College ${n} is a ${type.toLowerCase()} institution offering MBBS and allied medical courses with quality clinical exposure.`,
    totalSeats: 100 + (i % 5) * 50,
    courseOffered: "MBBS",

    // Full details (paid)
    fullDescription: `${city} Medical College ${n} is one of the reputed ${type.toLowerCase()} medical colleges in ${state}. It has a large attached teaching hospital, experienced faculty, and a strong focus on research and community medicine. The college follows the NMC curriculum and provides excellent clinical training across all major specialities.`,
    annualFees:
      type === "Government"
        ? "₹50,000 - ₹90,000 / year"
        : type === "Deemed"
        ? "₹15,00,000 - ₹22,00,000 / year"
        : "₹8,00,000 - ₹14,00,000 / year",
    hostelFees: "₹60,000 - ₹1,20,000 / year",
    cutoffGeneral: baseCutoff,
    cutoffOBC: baseCutoff + 3000,
    cutoffSC: baseCutoff + 9000,
    cutoffST: baseCutoff + 14000,
    placementInfo:
      "Graduates pursue PG/NEET-PG, government service, and residencies. Average internship stipend ₹15,000 - ₹30,000 / month.",
    facilities: facilitiesPool.slice(0, 5 + (i % 5)),
    address: `Plot ${n}, Medical Campus Road, ${city}, ${state}`,
    website: `https://college${n}.example.edu`,
    contactPhone: `+91-90000000${(10 + i).toString().slice(-2)}`,
    contactEmail: `info@college${n}.example.edu`,
  };
});

module.exports = colleges;
