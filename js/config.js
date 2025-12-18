// Browser-side config (NO secrets here)

export const ROUTE_DOCTORS = "/api/get_doctors";
export const ROUTE_APPOINTMENTS = "/api/create_appointment"; // change if your function route differs
export const ROUTE_DOCTOR_APPTS = "/api/get_doctor_appointments_by_id";

// Builds URL with optional query params
export function apiUrl(route, params = {}) {
  const u = new URL(route, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, v);
  });
  return u.toString();
}
