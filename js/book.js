import { apiUrl, ROUTE_DOCTORS, ROUTE_APPOINTMENTS } from "./config.js";
import { $, escapeHtml, toIso8601FromDatetimeLocal } from "./common.js";

let selectedDoctor = null;

function getDoctorIdFromUrl() {
  const u = new URL(window.location.href);
  return u.searchParams.get("doctorId");
}

function showResult(ok, html) {
  const box = $("resultBox");
  box.hidden = false;
  box.className = "result " + (ok ? "result--ok" : "result--bad");
  box.innerHTML = html;
}

async function loadDoctor(doctorId) {
  $("status").textContent = "Loading doctor…";
  $("btnBook").disabled = true;

  const res = await fetch(apiUrl(ROUTE_DOCTORS));
  const data = await res.json();

  if (!res.ok || !data.success) throw new Error(data.error || `HTTP ${res.status}`);

  const doctors = data.doctors || [];
  selectedDoctor = doctors.find(d => String(d.doctorId) === String(doctorId)) || null;

  if (!selectedDoctor) throw new Error("Doctor not found.");

  $("docCard").hidden = false;
  $("docPhoto").src = selectedDoctor.photoUrl || "";
  $("docName").textContent = selectedDoctor.fullName;
  $("docMeta").textContent = `${selectedDoctor.speciality} • Reception: ${selectedDoctor.receptionPhone || "—"}`;

  $("status").textContent = `Booking with doctor #${selectedDoctor.doctorId}.`;
  $("btnBook").disabled = false;
}

async function createAppointment(payload) {
  const res = await fetch(apiUrl(ROUTE_APPOINTMENTS), {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  return { res, data };
}

document.addEventListener("DOMContentLoaded", async () => {
  const doctorId = getDoctorIdFromUrl();
  if (!doctorId) {
    $("status").textContent = "Missing doctorId. Go back and select a doctor.";
    return;
  }

  try {
    await loadDoctor(doctorId);
  } catch (e) {
    $("status").textContent = `Error: ${e.message}`;
    return;
  }

  $("bookingForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = {
      doctorId: Number(selectedDoctor.doctorId),
      patientFullName: $("patientFullName").value.trim(),
      patientEmail: $("patientEmail").value.trim(),
      patientPhone: $("patientPhone").value.trim(),
      appointmentDateTime: toIso8601FromDatetimeLocal($("appointmentDateTime").value)
    };

    $("btnBook").disabled = true;
    $("status").textContent = "Submitting appointment…";

    try {
      const { res, data } = await createAppointment(payload);

      if (res.ok && data.success) {
        showResult(true, `
          <strong>✅ Appointment created!</strong><br/>
          Appointment ID: <code>${escapeHtml(data.appointmentId)}</code><br/>
          Date & time: <code>${escapeHtml(data.appointmentDateTime)}</code>
        `);
        $("status").textContent = "Booked successfully.";
      } else {
        showResult(false, `<strong>❌ Failed</strong><br/>${escapeHtml(data.message || `HTTP ${res.status}`)}`);
        $("status").textContent = "Fix inputs and try again.";
      }
    } catch (err) {
      showResult(false, `<strong>Error:</strong> ${escapeHtml(err.message)}`);
      $("status").textContent = "Error while booking.";
    } finally {
      $("btnBook").disabled = false;
    }
  });
});
