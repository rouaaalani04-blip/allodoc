const doctorIdEl = document.getElementById("doctorId");
const goBtn = document.getElementById("go");
const toastEl = document.getElementById("toast");

function toast(msg, kind) {
  toastEl.className = `toast show ${kind || ""}`;
  toastEl.textContent = msg;
}

goBtn.addEventListener("click", () => {
  const doctorId = (doctorIdEl.value || "").trim();
  if (!doctorId) return toast("Doctor ID is required.", "err");

  // store session in localStorage
  localStorage.setItem("ALLODOC_DOCTOR_ID", doctorId);
  window.location.href = `doctor-dashboard.html`;
});
