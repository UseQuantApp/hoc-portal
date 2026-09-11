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