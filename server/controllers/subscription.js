import Subscription from "../models/subscription.js";

export const getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      owner: req.user._id,
    });

    if (!subscription)
      return res.status(404).json({ message: "No subscription found" });

    res.json(subscription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
