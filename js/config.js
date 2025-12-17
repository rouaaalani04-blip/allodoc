// ===============================
// AlloDoc frontend configuration
// ===============================

// Azure Function App base URL
export const API_BASE =
  "https://allodoc-functions-bhfshjezgsb2b5d0.spaincentral-01.azurewebsites.net";

// Function key is injected at runtime (NOT stored in repo)
export const FUNCTION_KEY =
  localStorage.getItem("ALLODOC_FUNCTION_KEY") || "";

// API routes
export const ROUTE_DOCTORS = "/api/doctors";
export const ROUTE_APPOINTMENTS = "/api/appointments";
export const ROUTE_DOCTOR_APPTS = "/api/get_doctor_appointments";

// Build full API URL with optional query params
export function apiUrl(path, params = {}) {
  const url = new URL(API_BASE + path);

  // Append function key only if it exists
  if (FUNCTION_KEY) {
    url.searchParams.set("code", FUNCTION_KEY);
  }

  // Append extra parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}
