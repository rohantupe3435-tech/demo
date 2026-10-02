import jwt from "jsonwebtoken";

/**
 * Generate a signed JSON Web Token
 * @param {string} id - The MongoDB User ObjectId
 * @param {string} role - The User role ("customer" | "admin")
 * @returns {string} Signed JWT token
 */
export const generateToken = (id, role = "customer") => {
  const secret = process.env.JWT_SECRET || "default_jwt_secret_mini_ecommerce_demo";
  return jwt.sign({ id, role }, secret, {
    expiresIn: "30d"
  });
};

export default generateToken;
