const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Read secrets from Azure App Settings (NOT from GitHub)
const FUNCTIONS_BASE_URL = process.env.FUNCTIONS_BASE_URL; // e.g. https://xxxx.azurewebsites.net
const FUNCTIONS_KEY = process.env.FUNCTIONS_KEY;           // function key value

function ensureEnv(res) {
  if (!FUNCTIONS_BASE_URL || !FUNCTIONS_KEY) {
    res.status(500).json({
      error: "Missing FUNCTIONS_BASE_URL or FUNCTIONS_KEY in App Service environment variables."
    });
    return false;
  }
  return true;
}

// Needed for POST JSON bodies
app.use(express.json());

/**
 * GET /api/get_doctors
 * Browser calls this (no secrets). Server calls Azure Function with key.
 */
app.get("/api/get_doctors", async (req, res) => {
  try {
    if (!ensureEnv(res)) return;

    const url = `${FUNCTIONS_BASE_URL}/api/get_doctors?code=${encodeURIComponent(FUNCTIONS_KEY)}`;
    const r = await fetch(url);

    const text = await r.text();
    res.status(r.status).type(r.headers.get("content-type") || "application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
});

/**
 * GET /api/get_doctor_appointments_by_id?doctorId=123
 */
app.get("/api/get_doctor_appointments_by_id", async (req, res) => {
  try {
    if (!ensureEnv(res)) return;

    const doctorId = req.query.doctorId;
    if (!doctorId) return res.status(400).json({ error: "doctorId is required" });

    const url =
      `${FUNCTIONS_BASE_URL}/api/get_doctor_appointments_by_id` +
      `?doctorId=${encodeURIComponent(doctorId)}` +
      `&code=${encodeURIComponent(FUNCTIONS_KEY)}`;

    const r = await fetch(url);

    const text = await r.text();
    res.status(r.status).type(r.headers.get("content-type") || "application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
});

/**
 * POST /api/create_appointment
 * For booking. Frontend posts here, server forwards to Azure Function with key.
 */
app.post("/api/create_appointment", async (req, res) => {
  try {
    if (!ensureEnv(res)) return;

    const url = `${FUNCTIONS_BASE_URL}/api/create_appointment?code=${encodeURIComponent(FUNCTIONS_KEY)}`;

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(req.body ?? {})
    });

    const text = await r.text();
    res.status(r.status).type(r.headers.get("content-type") || "application/json").send(text);
  } catch (err) {
    res.status(500).json({ error: "Proxy failed", details: String(err) });
  }
});

// Serve static frontend files
app.use(express.static(__dirname));

// Fallback to index.html (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
