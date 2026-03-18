import * as jose from "jose";

if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET environment variable is not set. Set it in your .env file.");
}
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export const signToken = async (payload: object, expireOffset: string = "7d") => {
  return await new jose.SignJWT(payload as jose.JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expireOffset)
    .sign(SECRET);
}

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, SECRET);
    return payload;
  } catch(e) {
    return null;
  }
};
