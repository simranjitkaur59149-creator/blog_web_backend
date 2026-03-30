// import jwt from "jsonwebtoken";
// import User from "../model/user.js";
// const protectedRoutes = async (req, res, next) => {
//   let token;

//   console.log(req.headers.authorization);
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       console.log("working");
//       token = req.headers.authorization.split(" ")[1];
//       const decode = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decode.id).select("-password");
//       next();
//     } catch (error) {
//       console.error(error);
//       res.status(401);
//       next(new Error("Not authorized, token failed"));
//     }
//   }
//   if (!token) {
//     return res.json({ message: "Not Authorized" });
//   }
// };
// export default protectedRoutes;


import jwt from "jsonwebtoken";
import User from "../model/user.js";

const protectedRoutes = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    next(); // ✅ ONLY ONE EXIT
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protectedRoutes;