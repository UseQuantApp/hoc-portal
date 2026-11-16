import { apiFetch } from "@/lib/api";

export async function logoutStudent(redirect: (path: string) => void) {
  try {
    await apiFetch("/auth/logout", { method: "POST" });
  } catch (err) {
    console.error("Logout request failed:", err);
  } finally {
    localStorage.removeItem("quant_token");
    redirect("/");
  }
}

// Login answers 403 "The web portal is available to ambassadors only" on backends
// that don't yet issue a limited session to accounts awaiting authorization.
export function isAuthorizationPendingError(err: unknown) {
  return err instanceof Error && /ambassador/i.test(err.message);
}
