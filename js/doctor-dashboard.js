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
    // backend fields: patientFullName, appointmentDateTime, status
    const when =
      a.appointmentDateTime ?? a.datetime ?? a.dateTime ?? a.date ?? a.appointmentDate ?? "";

    const status = a.status ?? a.etat ?? "Pending";
    const patient =
      a.patientFullName ?? a.patientName ?? a.patient ?? a.fullName ?? "Patient";

    const notes = a.notes ?? a.reason ?? ""; // only if your backend has it

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

    // ✅ correct route
    const data = await fetchJson(
      `${API}/get_doctor_appointments?doctorId=${encodeURIComponent(doctorId)}`
    );

    // ✅ backend returns { doctorId, count, appointments: [...] }
    const items = data.appointments || data.items || [];
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

// initial load
loadAppointments();
