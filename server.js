import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Optional: if someone refreshes on /book.html etc
app.get(["/book", "/doctor-login", "/doctor-dashboard"], (req, res) => {
  res.sendFile(path.join(__dirname, `${req.path.replace("/", "")}.html`));
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`AlloDoc web running on :${port}`));
