import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    //access the jwt cookie
    const token = req.cookies.jwt;

    if (!token)
      return res.status(401).json({ error: "Unauthorized: No token Provided" });

    const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodedJWT)
      return res.status(401).json({ error: "unauthorized: Invalid Token" });

    const user = await User.findById(decodedJWT.userId).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
