import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth, isAllowedAdmin } from "@/lib/firebase/admin";

export const SESSION_COOKIE = "__session";
const sessionDurationMs = 5 * 24 * 60 * 60 * 1000;

export async function getVerifiedAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(token, true);
    if (!decoded.admin && !isAllowedAdmin(decoded.email)) return null;
    if (!isAllowedAdmin(decoded.email)) return null;
    return decoded;
  } catch {
    return null;
  }
}

export async function createSessionCookie(idToken: string) {
  const auth = getAdminAuth();
  const decoded = await auth.verifyIdToken(idToken);
  if (!isAllowedAdmin(decoded.email)) {
    throw new Error("This account is not authorized to access the CMS.");
  }
  return auth.createSessionCookie(idToken, { expiresIn: sessionDurationMs });
}
