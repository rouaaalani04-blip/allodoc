import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// Required for ES modules (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(__dirname));

// Root page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Explicit routes for HTML pages (safe refresh support)
app.get("/book", (req, res) => {
  res.sendFile(path.join(__dirname, "book.html"));
});

app.get("/doctor-login", (req, res) => {
  res.sendFile(path.join(__dirname, "doctor-login.html"));
});

app.get("/doctor-dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "doctor-dashboard.html"));
});

// Also allow direct .html access (optional but helpful)
app.get("/book.html", (req, res) => {
  res.sendFile(path.join(__dirname, "book.html"));
});

app.get("/doctor-login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "doctor-login.html"));
});

app.get("/doctor-dashboard.html", (req, res) => {
  res.sendFile(path.join(__dirname, "doctor-dashboard.html"));
});

// Azure uses PORT env variable
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`✅ AlloDoc Web App running on port ${port}`);
});
