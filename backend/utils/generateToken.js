import jwt from 'jsonwebtoken';

const generateToken = (id, role) => {
  const secret = process.env.JWT_SECRET || 'supersecret_jwt_key_placement_2026';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ id, role }, secret, { expiresIn });
};

export default generateToken;
