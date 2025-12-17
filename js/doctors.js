import { apiUrl, ROUTE_DOCTORS } from "./config.js";
import { $, escapeHtml } from "./common.js";

let allDoctors = [];

function populateSpecialities() {
  const sel = $("specialityFilter");
  const specs = Array.from(new Set(allDoctors.map(d => d.speciality).filter(Boolean))).sort();
  sel.innerHTML = `<option value="">All specialities</option>` + specs.map(s =>
    `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`
  ).join("");
}

function docCardHtml(d) {
  const photo = d.photoUrl || "";
  const phone = d.receptionPhone || "—";

  return `
    <div class="doc">
      <img class="doc__img" src="${escapeHtml(photo)}" alt="Doctor photo"
           onerror="this.style.display='none';" />
      <div class="doc__body">
        <div class="doc__name">${escapeHtml(d.fullName)}</div>
        <div class="doc__meta">${escapeHtml(d.speciality)} • Reception: ${escapeHtml(phone)}</div>
      </div>
      <div class="doc__actions">
        <button class="btn btn--primary" data-book="${d.doctorId}">Book</button>
      </div>
    </div>
  `;
}

function renderDoctors() {
  const q = $("searchInput").value.trim().toLowerCase();
  const spec = $("specialityFilter").value;

  const filtered = allDoctors.filter(d => {
    const name = (d.fullName || "").toLowerCase();
    const sp = (d.speciality || "");
    return (!q || name.includes(q) || sp.toLowerCase().includes(q)) &&
           (!spec || sp === spec);
  });

  $("doctorsList").innerHTML = filtered.map(docCardHtml).join("") ||
    `<div class="small" style="padding:16px;">No results.</div>`;

  filtered.forEach(d => {
    const btn = document.querySelector(`[data-book="${d.doctorId}"]`);
    if (btn) btn.addEventListener("click", () => {
      // Pass doctorId in URL
      window.location.href = `./book.html?doctorId=${encodeURIComponent(d.doctorId)}`;
    });
  });
}

async function loadDoctors() {
  $("status").textContent = "Loading doctors…";
  try {
    const res = await fetch(apiUrl(ROUTE_DOCTORS));
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);

    allDoctors = data.doctors || [];
    populateSpecialities();
    renderDoctors();
    $("status").textContent = `Loaded ${allDoctors.length} doctor(s).`;
  } catch (e) {
    $("status").textContent = `Error: ${e.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  $("btnLoadDoctors").addEventListener("click", loadDoctors);
  $("searchInput").addEventListener("input", renderDoctors);
  $("specialityFilter").addEventListener("change", renderDoctors);
});
