import * as jose from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_super_secret");

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
