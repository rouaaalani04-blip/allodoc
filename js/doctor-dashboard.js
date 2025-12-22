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

  if (!Array.isArray(items) || items.length === 0) {
    listEl.innerHTML = `<div class="small">No appointments.</div>`;
    return;
  }

  for (const a of items) {
    const patient = a.patientFullName || "Patient";
    const when = a.appointmentDateTime || "(no datetime)";
    const email = a.patientEmail || "";
    const phone = a.patientPhone || "";
    const createdAt = a.createdAt || "";

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="meta">
        <div class="title">${patient}</div>
        <div class="sub">${when}</div>
        <div class="small" style="margin-top:6px">
          ${email ? `${email}` : ""}
          ${email && phone ? " • " : ""}
          ${phone ? `${phone}` : ""}
          ${createdAt ? `<div style="margin-top:4px">Created: ${createdAt}</div>` : ""}
        </div>
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

    const data = await fetchJson(
      `${API}/appointments/doctor?doctorId=${encodeURIComponent(doctorId)}`
    );

    render(data.appointments || []);
    toast(`Loaded: (${data.count ?? 0})`, "ok");
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

// auto-load
loadAppointments();
