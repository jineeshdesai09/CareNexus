import { cookies } from "next/headers";

const SESSION_NAME = "opd_session";

export async function createSession(userId: number) {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_NAME, String(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_NAME)?.value;
  return value ? Number(value) : null;
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_NAME);
}
