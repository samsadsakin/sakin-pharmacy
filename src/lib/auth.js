import {
  SignJWT,
  jwtVerify,
} from "jose";


// =========================
// SECRET
// =========================

function getSecret() {
  const secret =
    process.env.JWT_SECRET;


  if (!secret) {
    throw new Error(
      "JWT_SECRET is missing"
    );
  }


  return new TextEncoder().encode(
    secret
  );
}


// =========================
// CREATE SESSION TOKEN
// =========================

export async function createSessionToken(
  user
) {
  return new SignJWT({
    userId:
      user._id.toString(),

    name:
      user.name,

    mobile:
      user.mobile,

    role:
      user.role,
  })
    .setProtectedHeader({
      alg: "HS256",
    })

    .setIssuedAt()

    .setExpirationTime("7d")

    .sign(
      getSecret()
    );
}


// =========================
// VERIFY SESSION TOKEN
// =========================

export async function verifySessionToken(
  token
) {
  try {

    const {
      payload,
    } = await jwtVerify(
      token,
      getSecret()
    );


    return payload;

  } catch {
    return null;
  }
}