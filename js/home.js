const toastEl = document.getElementById("toast");
const listEl = document.getElementById("doctors");
const searchEl = document.getElementById("search");
const reloadBtn = document.getElementById("reload");

let allDoctors = [];

function toast(msg, kind) {
  toastEl.className = `toast show ${kind || ""}`;
  toastEl.textContent = msg;
}

function safeDoctorId(d) {
  return d.doctorId ?? d.id ?? d.DoctorId ?? d.DOCTOR_ID ?? d.ID ?? null;
}

function render(doctors) {
  listEl.innerHTML = "";

  if (!Array.isArray(doctors) || doctors.length === 0) {
    listEl.innerHTML = `<div class="small">No doctors found.</div>`;
    return;
  }

  for (const d of doctors) {
    const doctorId = safeDoctorId(d);

    // backend fields: fullName, speciality, photoUrl, doctorId
    const name = d.fullName ?? d.name ?? d.nom ?? "Doctor";
    const specialty =
      d.specialty ?? d.speciality ?? d.specialite ?? d.service ?? "Specialty";
    const city = d.city ?? d.ville ?? d.location ?? "";
    const img = d.photoUrl ?? d.photo_url ?? d.imageUrl ?? d.image_url ?? "";

    const item = document.createElement("div");
    item.className = "item";

    item.innerHTML = `
      <div class="avatar">${img ? `<img alt="" src="${img}">` : ""}</div>
      <div class="meta">
        <div class="title">${name}</div>
        <div class="sub">${specialty}${city ? " • " + city : ""}</div>
        <div class="small">Doctor ID: ${doctorId ?? "?"}</div>
      </div>
      <div class="right">
        <a class="btn primary" href="book.html?doctorId=${encodeURIComponent(
          doctorId ?? ""
        )}">Book</a>
      </div>
    `;

    listEl.appendChild(item);
  }
}

async function loadDoctors() {
  try {
    toast("Loading doctors...", "");
    const API = getApiBase();

    // correct route from your backend contract
    const data = await fetchJson(`${API}/doctors`);

    // backend returns { doctors: [...] }
    allDoctors = Array.isArray(data) ? data : (data.doctors || data.items || []);

    render(allDoctors);
    toast("Doctors loaded", "ok");
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

searchEl.addEventListener("input", () => {
  const q = (searchEl.value || "").toLowerCase().trim();
  if (!q) return render(allDoctors);

  const filtered = allDoctors.filter((d) => {
    const name = (d.fullName ?? d.name ?? d.nom ?? "").toLowerCase();
    const sp = (
      d.specialty ??
      d.speciality ??
      d.specialite ??
      d.service ??
      ""
    ).toLowerCase();

    return name.includes(q) || sp.includes(q);
  });

  render(filtered);
});

reloadBtn.addEventListener("click", loadDoctors);

// initial load
loadDoctors();
