const doctorIdEl = document.getElementById("doctorId");
const loadBtn = document.getElementById("load");
const logoutBtn = document.getElementById("logout");
const toastEl = document.getElementById("toast");
const listEl = document.getElementById("appointments");

function toast(msg, kind) {
  toastEl.className = `toast show ${kind || ""}`;
  toastEl.textContent = msg;
}

function render(items) {
  listEl.innerHTML = "";
  if (!items.length) {
    listEl.innerHTML = `<div class="small">No appointments.</div>`;
    return;
  }

  for (const a of items) {
    const when = a.datetime ?? a.dateTime ?? a.date ?? a.appointmentDate ?? "";
    const status = a.status ?? a.etat ?? "Pending";
    const patient = a.patientName ?? a.patient ?? a.fullName ?? "Patient";
    const notes = a.notes ?? a.reason ?? "";

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="meta">
        <div class="title">${patient}</div>
        <div class="sub">${when || "(no datetime)"} • ${status}</div>
        ${notes ? `<div class="small" style="margin-top:6px">${notes}</div>` : ""}
      </div>
    `;
    listEl.appendChild(div);
  }
}

async function loadAppointments() {
  try {
    const doctorId = (doctorIdEl.value || "").trim();
    if (!doctorId) return toast("Doctor ID is required.", "err");

    toast("Loading appointments...", "");
    const API = getApiBase();

    const data = await fetchJson(`${API}/get_doctor_appointments_by_id?doctorId=${encodeURIComponent(doctorId)}`);
    const items = Array.isArray(data) ? data : (data.appointments || data.items || []);
    render(items);
    toast("Loaded ✅", "ok");
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

function initDoctorId() {
  const saved = localStorage.getItem("ALLODOC_DOCTOR_ID");
  if (saved) doctorIdEl.value = saved;
}
initDoctorId();

loadBtn.addEventListener("click", loadAppointments);
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("ALLODOC_DOCTOR_ID");
  window.location.href = "doctor-login.html";
});

loadAppointments();
