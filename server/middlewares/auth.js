import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ msg: "Not authenticated" });

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ msg: "User no longer exists" });

    req.user = user;
    next();

  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: "Not authenticated" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ msg: "Forbidden" });
  next();
};