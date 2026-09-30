const API_BASE = "https://quant-production-1004.up.railway.app/api/v1";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("quant_token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("API error response:", data); // temporary — remove once fully working
    const detailMessage =
      typeof data.details === "string"
        ? data.details
        : Array.isArray(data.details)
        ? data.details.join(", ")
        : data.details
        ? JSON.stringify(data.details)
        : "";
    throw new Error(detailMessage || data.message || "Something went wrong. Please try again.");
  }

  return data;
}

// CHANGED: added an optional `method` param (defaults to "POST" so existing
// callers are unaffected) — needed for endpoints like PATCH /students/me/photo
export async function apiFetchFormData(path: string, formData: FormData, method: string = "POST") {
  const token = typeof window !== "undefined" ? localStorage.getItem("quant_token") : null;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("API error response:", data);
    const detailMessage =
      typeof data.details === "string"
        ? data.details
        : Array.isArray(data.details)
        ? data.details.join(", ")
        : data.details
        ? JSON.stringify(data.details)
        : "";
    throw new Error(detailMessage || data.message || "Something went wrong. Please try again.");
  }

  return data;
}