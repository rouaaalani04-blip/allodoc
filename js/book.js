const doctorIdEl = document.getElementById("doctorId");
const patientNameEl = document.getElementById("patientName");
const patientEmailEl = document.getElementById("patientEmail");
const patientPhoneEl = document.getElementById("patientPhone");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");

const submitBtn = document.getElementById("submit");
const toastEl = document.getElementById("toast");

function toast(msg, kind) {
  toastEl.className = `toast show ${kind || ""}`;
  toastEl.textContent = msg;
}

function setFromQuery() {
  const qDoctorId = qs("doctorId");
  if (qDoctorId) doctorIdEl.value = qDoctorId;
}
setFromQuery();

async function createAppointment() {
  try {
    const doctorIdRaw = (doctorIdEl.value || "").trim();
    const patientFullName = (patientNameEl.value || "").trim();
    const patientEmail = (patientEmailEl.value || "").trim();
    const patientPhone = (patientPhoneEl.value || "").trim();
    const date = dateEl.value;
    const time = timeEl.value;

    if (!doctorIdRaw) return toast("Doctor ID is required.", "err");
    if (!patientFullName) return toast("Patient name is required.", "err");
    if (!patientEmail) return toast("Email is required.", "err");
    if (!patientPhone) return toast("Phone number is required.", "err");
    if (!date || !time) return toast("Date + Time are required.", "err");

    const doctorId = Number(doctorIdRaw);
    if (Number.isNaN(doctorId)) return toast("Doctor ID must be a number.", "err");

    const appointmentDateTime = `${date}T${time}:00`;

    const payload = {
      doctorId,
      patientFullName,
      patientEmail,
      patientPhone,
      appointmentDateTime
    };

    toast("Creating appointment...", "");
    const API = getApiBase();

    const data = await fetchJson(`${API}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    toast(`Appointment created ✅ ${data.message || ""}`.trim(), "ok");

    // optional: clear fields after success
    // patientNameEl.value = "";
    // patientEmailEl.value = "";
    // patientPhoneEl.value = "";
    // dateEl.value = "";
    // timeEl.value = "";
  } catch (e) {
    console.error(e);
    toast(`Error: ${e.message}`, "err");
  }
}

submitBtn.addEventListener("click", createAppointment);
