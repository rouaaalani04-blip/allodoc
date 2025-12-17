import { setDoctorSession, $, escapeHtml } from "./common.js";

document.addEventListener("DOMContentLoaded", () => {
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const doctorId = Number($("doctorId").value);
    const password = $("password").value;

    // ✅ Demo rule (replace later with real backend auth)
    if (!doctorId || doctorId < 1) {
      $("status").textContent = "Invalid doctor ID.";
      return;
    }
    if (password !== "demo") {
      $("status").textContent = "Wrong password (use demo).";
      return;
    }

    setDoctorSession({ doctorId });
    window.location.href = "./doctor-dashboard.html";
  });
});
