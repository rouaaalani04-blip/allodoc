import { apiUrl, ROUTE_DOCTOR_APPTS } from "./config.js";
import { requireDoctorSession, clearDoctorSession, $, escapeHtml, formatPrettyDateTime } from "./common.js";

async function loadAppointments() {
  const session = requireDoctorSession();
  if (!session) return;

  $("status").textContent = `Loading appointments for doctor #${session.doctorId}…`;
  $("apptList").innerHTML = "";

  try {
    const res = await fetch(apiUrl(ROUTE_DOCTOR_APPTS, { doctorId: session.doctorId }));
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);

    const appts = data.appointments || [];
    $("status").textContent = `Found ${appts.length} appointment(s) for doctor #${session.doctorId}.`;

    $("apptList").innerHTML = appts.map(a => `
      <div class="appt">
        <div class="appt__top">
          <div class="appt__name">${escapeHtml(a.patientFullName)}</div>
          <div class="appt__dt">${escapeHtml(formatPrettyDateTime(a.appointmentDateTime))}</div>
        </div>
        <div class="small">Email: ${escapeHtml(a.patientEmail)} • Phone: ${escapeHtml(a.patientPhone || "—")}</div>
      </div>
    `).join("") || `<div class="small">No appointments yet.</div>`;
  } catch (e) {
    $("status").textContent = `Error: ${e.message}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  requireDoctorSession();

  $("btnRefresh").addEventListener("click", loadAppointments);
  $("btnLogout").addEventListener("click", () => {
    clearDoctorSession();
    window.location.href = "./doctor-login.html";
  });

  loadAppointments();
});
