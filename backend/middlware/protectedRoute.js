import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No Poken Provided!",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token!",
      });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found, authorization denied",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error!", message: error.message });
  }
};
