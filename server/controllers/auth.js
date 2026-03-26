import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase();

    const existing = await User.findOne({ email: emailLower });
    if (existing) return res.status(400).json({ msg: "User exists" });

    await User.create({ name, email: emailLower, password });

    res.json({ msg: "Signup successful. Waiting for admin approval" });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) return res.status(400).json({ msg: "User not found" });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ msg: "Invalid password" });

    if (user.status !== "ACTIVE") return res.status(403).json({ msg: "Account pending approval" });

    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not defined");

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production"
    });

    const { password: _, ...safeUser } = user.toObject();
    res.json({ msg: "Login successful",
      token,
       user: safeUser });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};