import axios from "axios";
import dayjs from "dayjs";

export const verifyPayment = async (req, res) => {
  const { token, amount } = req.body;

  try {
    const expectedAmount = 1000; // example amount in paisa

    if (amount !== expectedAmount) {
      return res.status(400).json({ msg: "Invalid amount" });
    }

    const response = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      { token, amount },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        },
      }
    );

    if (!response.data || response.data.state.name !== "Completed") {
      return res.status(400).json({ msg: "Payment not completed" });
    }

    req.user.subscription = "ACTIVE";
    req.user.trialEnd = dayjs().add(30, "day").toDate();

    await req.user.save();

    res.json({ msg: "Payment verified. Subscription active" });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(400).json({ msg: "Payment failed" });
  }
};