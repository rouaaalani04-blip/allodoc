const doctorIdEl = document.getElementById("doctorId");
const patientNameEl = document.getElementById("patientName");
const patientEmailEl = document.getElementById("patientEmail");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const notesEl = document.getElementById("notes"); // optional, backend may ignore

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

  if (!Array.isArray(items) || items.length === 0) {
    apptListEl.innerHTML = `<div class="small">No appointments.</div>`;
    return;
  }

  for (const a of items) {
    // backend returns: appointmentId, doctorId, patientFullName, patientEmail, patientPhone, appointmentDateTime, status
    const when =
      a.appointmentDateTime ?? a.datetime ?? a.dateTime ?? a.date ?? a.appointmentDate ?? "";

    const status = a.status ?? a.etat ?? "Pending";
    const patient =
      a.patientFullName ?? a.patientName ?? a.patient ?? a.fullName ?? "Patient";

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

    // ✅ correct route from your backend contract
    const data = await fetchJson(
      `${API}/get_doctor_appointments?doctorId=${encodeURIComponent(doctorId)}`
    );

    // ✅ backend returns { doctorId, count, appointments: [...] }
    const items = data.appointments || data.items || [];
    renderAppointments(items);

    toast("Appointments loaded ✅", "ok");
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

async function createAppointment() {
  try {
    const doctorIdRaw = (doctorIdEl.value || "").trim();
    const patientFullName = (patientNameEl.value || "").trim();
    const patientEmail = (patientEmailEl.value || "").trim();
    const date = dateEl.value;
    const time = timeEl.value;
    const notes = (notesEl.value || "").trim(); // optional

    if (!doctorIdRaw) return toast("Doctor ID is required.", "err");
    if (!patientFullName) return toast("Patient name is required.", "err");
    if (!date || !time) return toast("Date + Time are required.", "err");

    const doctorId = Number(doctorIdRaw);
    if (Number.isNaN(doctorId)) return toast("Doctor ID must be a number.", "err");

    // ✅ backend expects a single ISO datetime string (appointmentDateTime)
    const appointmentDateTime = `${date}T${time}:00`;

    // ✅ backend required keys
    const payload = {
      doctorId,
      patientFullName,
      patientEmail,
      patientPhone: "",          // add an input later if you want
      appointmentDateTime
      // notes is not in the backend contract; keep only if your backend supports it:
      // notes
    };

    toast("Creating appointment...", "");
    const API = getApiBase();

    // ✅ correct route from your backend contract
    const data = await fetchJson(`${API}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    toast(`Created ✅ ${data.message || ""}`.trim(), "ok");

    // refresh
    await loadAppointments();
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

submitBtn.addEventListener("click", createAppointment);
loadBtn.addEventListener("click", loadAppointments);
