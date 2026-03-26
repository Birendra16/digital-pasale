import User from "../models/user.js";
import dayjs from "dayjs";

export const listPending = async (req, res) => {
  try {
    const users = await User.find({ status: "PENDING" });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.status = "ACTIVE";
    user.role = "OWNER";
    user.subscription = "TRIAL";
    user.trialEnd = dayjs().add(7, "day").toDate();

    await user.save();

    const { password: _, ...safeUser } = user.toObject();
    res.json({ msg: "User approved with 7-day trial", user: safeUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.status = "REJECTED";
    await user.save();

    const { password: _, ...safeUser } = user.toObject();
    res.json({ msg: "User rejected", user: safeUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const dashboardStats = async (req, res) => {
  try {
    const pending = await User.countDocuments({ status: "PENDING" });
    const active = await User.countDocuments({ status: "ACTIVE" });
    const rejected = await User.countDocuments({ status: "REJECTED" });

    res.json({ pending, active, rejected });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

export const dailySignups = async (req, res) => {
  try {
    // last 7 days
    const today = dayjs();
    const last7Days = Array.from({ length: 7 }).map((_, i) =>
      today.subtract(i, "day").format("YYYY-MM-DD")
    ).reverse();

    const users = await User.find({
      createdAt: { $gte: today.subtract(6, "day").startOf("day").toDate() },
    });

    const data = last7Days.map(date => ({
      date,
      count: users.filter(u =>
        dayjs(u.createdAt).format("YYYY-MM-DD") === date
      ).length,
    }));

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
