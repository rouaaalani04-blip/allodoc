export const $ = (id) => document.getElementById(id);

export function escapeHtml(str) {
  return (str ?? "")
    .toString()
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatPrettyDateTime(isoString) {
  try {
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    return d.toLocaleString();
  } catch {
    return isoString;
  }
}

export function toIso8601FromDatetimeLocal(value) {
  if (!value) return "";
  return value.length === 16 ? value + ":00" : value;
}

/***************
 * Demo “Doctor auth” (NOT secure)
 ***************/
const KEY = "doctor_session";

export function setDoctorSession(session) {
  localStorage.setItem(KEY, JSON.stringify(session));
}

export function getDoctorSession() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function clearDoctorSession() {
  localStorage.removeItem(KEY);
}

export function requireDoctorSession() {
  const s = getDoctorSession();
  if (!s?.doctorId) {
    window.location.href = "./doctor-login.html";
    return null;
  }
  return s;
}
