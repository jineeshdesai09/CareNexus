import { cookies } from "next/headers";
import { signToken, verifyToken } from "./jwt";

const SESSION_NAME = "opd_session";

export async function createSession(userId: number) {
  const cookieStore = await cookies();
  const token = await signToken({ userId });

  cookieStore.set(SESSION_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days — matches JWT expiry
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_NAME)?.value;
  if (!value) return null;

  const vUser = await verifyToken(value);
  if (vUser && vUser.userId) {
    return Number(vUser.userId);
  }
  return null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_NAME);
}
