import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const token = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "100d" });
};
export default token;
