import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function createToken(user) {
  return jwt.sign(
    { 
      userId: user._id,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified || user.isEmailVerified || false,
      firstName: user.firstName,
      lastName: user.lastName
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);

  } catch(error) {
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
    return null;
  }
}