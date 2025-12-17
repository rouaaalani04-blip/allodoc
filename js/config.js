// ===============================
// AlloDoc frontend configuration
// ===============================

export const API_BASE =
  "https://allodoc-functions-bhfshjezgsb2b5d0.spaincentral-01.azurewebsites.net";

export const FUNCTION_KEY =
  localStorage.getItem("ALLODOC_FUNCTION_KEY") || "";

// API routes
export const ROUTE_DOCTORS = "/api/doctors";
export const ROUTE_APPOINTMENTS = "/api/appointments";
export const ROUTE_DOCTOR_APPTS = "/api/get_doctor_appointments";

// Build full API URL with optional query params
export function apiUrl(path, params = {}) {
  const url = new URL(API_BASE + path);

  if (FUNCTION_KEY) {
    url.searchParams.set("code", FUNCTION_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}
// ===============================
// AlloDoc frontend configuration
// ===============================

export const API_BASE =
  "https://allodoc-functions-bhfshjezgsb2b5d0.spaincentral-01.azurewebsites.net";

export const FUNCTION_KEY =
  localStorage.getItem("ALLODOC_FUNCTION_KEY") || "";

// API routes
export const ROUTE_DOCTORS = "/api/doctors";
export const ROUTE_APPOINTMENTS = "/api/appointments";
export const ROUTE_DOCTOR_APPTS = "/api/get_doctor_appointments";

// Build full API URL with optional query params
export function apiUrl(path, params = {}) {
  const url = new URL(API_BASE + path);

  if (FUNCTION_KEY) {
    url.searchParams.set("code", FUNCTION_KEY);
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}
