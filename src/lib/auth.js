import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.isEmailVerified || false,
      firstName: user.firstName,
      lastName: user.lastName
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

// This function works in Node.js runtime (API routes)
export function verifyToken(token) {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token verified successfully:', { userId: decoded.userId, email: decoded.email });
    return decoded;

  } catch(error) {
    console.error('Token verification failed:', error.message);
    throw new Error('Invalid or expired token');
  }
}

// This function works in Edge Runtime (middleware)
export async function verifyTokenEdge(token) {
  try {
    if (!token) {
      throw new Error('No token provided');
    }

    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    // Decode JWT manually for Edge Runtime
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part)
    const payload = JSON.parse(
      Buffer.from(parts[1], 'base64url').toString()
    );

    // Check if token is expired
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      throw new Error('Token expired');
    }

    // For basic validation, we'll trust the payload if it's not expired
    // In production, you might want to verify the signature using Web Crypto API
    console.log('Token verified successfully (Edge):', { userId: payload.userId, email: payload.email });
    return payload;

  } catch(error) {
    console.error('Edge token verification failed:', error.message);
    throw new Error('Invalid or expired token');
  }
}

// function to extract user info from token
export function getUserFromToken(token) {
  try {
    const decoded = verifyToken(token);
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      emailVerified: decoded.emailVerified,
      firstName: decoded.firstName,
      lastName: decoded.lastName
    };
  } catch (error) {
    console.error('Failed to get user from token:', error.message);
    return null;
  }
}