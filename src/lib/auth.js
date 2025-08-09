import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Create a JWT token with user info, expires in 1 day
export function createToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.isEmailVerified || false,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
    },
    JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

// Verify a JWT token on the server side and return decoded info
export function verifyToken(token) {
  try {
    if (!token){
      throw new Error("No token provided");
    } 
    if (!JWT_SECRET){
      throw new Error("JWT_SECRET is not defined");
    } 

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error.message);
    throw new Error("Invalid or expired token");
  }
}

// Verify JWT token in Edge runtime by decoding payload and checking expiry (no signature verification)
export async function verifyTokenEdge(token) {
  try {
    if (!token) {
      throw new Error("No token provided");
    }
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format");
    }

    // Decode Base64Url payload part
    const payloadJson = Buffer.from(parts[1], "base64url").toString();
    const payload = JSON.parse(payloadJson);

    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error("Token expired");
    }

    return payload;
  } catch (error) {
    console.error("Edge token verification failed:", error.message);
    throw new Error("Invalid or expired token");
  }

}

// Extract user data from a valid JWT token or return null if invalid
export function getUserFromToken(token) {
  try {
    const decoded = verifyToken(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      emailVerified: decoded.emailVerified,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
    };
  } catch (error) {
    console.error("Failed to get user from token:", error.message);
    return null;
  }
}
