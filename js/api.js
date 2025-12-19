function getApiBase() {
  const base = window.ALLODOC_FUNCTION_BASE;
  if (!base || base.includes("YOUR-FUNCTION-APP")) {
    throw new Error("ALLODOC_FUNCTION_BASE is not set. Edit js/config.js");
  }
  return `${base.replace(/\/+$/, "")}/api`;
}

async function fetchJson(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();

  // Helpful debugging (fixes the “Unexpected token <” mystery)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 250)}`);
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Not JSON (first chars): ${text.slice(0, 250)}`);
  }
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}
