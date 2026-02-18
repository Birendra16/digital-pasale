import Subscription from "../models/subscription.js";

export const checkSubscription = async (req, res, next) => {
  const sub = await Subscription.findOne({ owner: req.user._id });

  if (!sub || !sub.isActive)
    return res.status(403).json({ message: "Subscription required" });

  if (new Date(sub.endDate) < new Date()) {
    sub.isActive = false;
    await sub.save();
    return res.status(403).json({ message: "Subscription expired" });
  }

  next();
};
