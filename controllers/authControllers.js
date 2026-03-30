import { compare, hash } from "bcrypt";
import User from "../model/user.js";
import token from "../utils/tokenGeneration.js";

const SALTVALUE = 12;
export const register = async (req, res, next) => {
  try {
    let { name, email, password } = req.body;
    email = email.toLowerCase();
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ message: "User already exists" });
    }
    const hashPassword = await hash(password, SALTVALUE);
    const user = await User.create({ name, email, password: hashPassword });
    if (user) {
      return res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token(user._id),
      });
    } else {
      return res.status(503).json({ message: "Invaild" });
    }
  } catch (error) {
    console.log(error.message);
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    next(error);
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password both are required" });
    }
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(401).json({ message: "User is not found" });
    }
    const isMatch = await compare(password, userExist.password);
    if (!isMatch) {
      return res
        .status(422)
        .json({ message: "Email and Password is not exists" });
    }
    res.status(200).json({
      success: true,
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
      },
      token: token(userExist._id),
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};
