const doctorIdEl = document.getElementById("doctorId");
const patientNameEl = document.getElementById("patientName");
const patientEmailEl = document.getElementById("patientEmail");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const notesEl = document.getElementById("notes");

const submitBtn = document.getElementById("submit");
const loadBtn = document.getElementById("load");
const toastEl = document.getElementById("toast");
const apptListEl = document.getElementById("appointments");

function toast(msg, kind) {
  toastEl.className = `toast show ${kind || ""}`;
  toastEl.textContent = msg;
}

function setFromQuery() {
  const qDoctorId = qs("doctorId");
  if (qDoctorId) doctorIdEl.value = qDoctorId;
}
setFromQuery();

function renderAppointments(items) {
  apptListEl.innerHTML = "";
  if (!items.length) {
    apptListEl.innerHTML = `<div class="small">No appointments.</div>`;
    return;
  }

  for (const a of items) {
    const when = a.datetime ?? a.dateTime ?? a.date ?? a.appointmentDate ?? "";
    const status = a.status ?? a.etat ?? "Pending";
    const patient = a.patientName ?? a.patient ?? a.fullName ?? "Patient";

    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div class="meta">
        <div class="title">${patient}</div>
        <div class="sub">${when || "(no datetime)"} • ${status}</div>
      </div>
    `;
    apptListEl.appendChild(div);
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
    renderAppointments(items);
    toast("Appointments loaded ✅", "ok");
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

async function createAppointment() {
  try {
    const doctorId = (doctorIdEl.value || "").trim();
    const patientName = (patientNameEl.value || "").trim();
    const patientEmail = (patientEmailEl.value || "").trim();
    const date = dateEl.value;
    const time = timeEl.value;
    const notes = (notesEl.value || "").trim();

    if (!doctorId) return toast("Doctor ID is required.", "err");
    if (!patientName) return toast("Patient name is required.", "err");
    if (!date || !time) return toast("Date + Time are required.", "err");

    const payload = {
      doctorId,
      patientName,
      patientEmail,
      date,
      time,
      notes
    };

    toast("Creating appointment...", "");
    const API = getApiBase();

    // assumes your function is POST /create_appointment
    const data = await fetchJson(`${API}/create_appointment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    toast(`Created ✅ ${data.message || ""}`.trim(), "ok");

    // refresh list (if backend stores immediately)
    await loadAppointments();
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

submitBtn.addEventListener("click", createAppointment);
loadBtn.addEventListener("click", loadAppointments);
