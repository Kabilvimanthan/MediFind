const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

let pharmacies = [
  { id: 1, name: "Sai Pharmacy", area: "Chennai", lat: 13.0067, lon: 80.2206,
    medicines: { paracetamol: 42, azithromycin: 12, amoxicillin: 8 } },
  { id: 2, name: "City Care Pharmacy", area: "Chennai", lat: 13.0210, lon: 80.2150,
    medicines: { paracetamol: 18, azithromycin: 0, amoxicillin: 15 } },
  { id: 3, name: "HealthPlus Pharmacy", area: "Chennai", lat: 13.0330, lon: 80.2500,
    medicines: { paracetamol: 0, azithromycin: 7, amoxicillin: 3 } }
];

app.get("/api/search", (req, res) => {
  const q = String(req.query.medicine || "").trim().toLowerCase();
  if (!q) return res.json([]);
  const results = pharmacies.map(p => ({
    id: p.id, name: p.name, area: p.area,
    stock: p.medicines[q] || 0,
    available: (p.medicines[q] || 0) > 0,
    lat: p.lat, lon: p.lon
  }));
  res.json(results);
});

app.post("/api/reserve", (req, res) => {
  const { pharmacyId, medicine } = req.body;
  const p = pharmacies.find(x => x.id === Number(pharmacyId));
  const key = String(medicine || "").toLowerCase();
  if (!p || !p.medicines[key] || p.medicines[key] <= 0)
    return res.status(400).json({ message: "Medicine is not currently available." });
  p.medicines[key]--;
  res.json({ message: `Reservation request accepted at ${p.name}. Please verify availability before travel.` });
});

app.post("/api/inventory", (req, res) => {
  const { pharmacyId, medicine, stock } = req.body;
  const p = pharmacies.find(x => x.id === Number(pharmacyId));
  if (!p) return res.status(404).json({ message: "Pharmacy not found." });
  p.medicines[String(medicine).toLowerCase()] = Math.max(0, Number(stock) || 0);
  res.json({ message: "Inventory updated.", pharmacy: p });
});

app.listen(3000, () => console.log("MediFind running at http://localhost:3000"));
