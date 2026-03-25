import Sales from "../models/sales.js";
import Purchase from "../models/purchase.js";
import Customer from "../models/customer.js";
import Inventory from "../models/inventory.js";

export const getDashboardMetrics = async (req, res) => {
  try {
    // 1. Basic Counts
    const customersCount = await Customer.countDocuments();
    // const productsCount = await Product.countDocuments();

    // 2. Sales & Purchase Amounts
    const salesAgg = await Sales.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);
    const salesAmount = salesAgg[0]?.totalSales || 0;

    const purchaseAgg = await Purchase.aggregate([
      { $group: { _id: null, totalPurchase: { $sum: "$totalAmount" } } },
    ]);
    const purchaseAmount = purchaseAgg[0]?.totalPurchase || 0;

    // 3. Profit/Loss
    const profitLoss = salesAmount - purchaseAmount;

    // 4. Stock Amount (Value of current inventory)
    // using totalBuyingUnits * lastCostPrice as a rough estimate of inventory value
    const stockAgg = await Inventory.aggregate([
      {
        $group: {
          _id: null,
          totalStockValue: {
            $sum: { $multiply: ["$totalBuyingUnits", "$lastCostPrice"] },
          },
        },
      },
    ]);
    const stockAmount = stockAgg[0]?.totalStockValue || 0;

    // 5. Top 5 Selling Products
    const topProducts = await Sales.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          sku: { $first: "$items.sku" },
          totalQuantitySold: { $sum: "$items.totalSubUnits" },
          totalRevenue: { $sum: "$items.totalAmount" },
        },
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 5 },
    ]);

    // 6. Top 5 Customers
    const topCustomers = await Sales.aggregate([
      { $match: { customer: { $ne: null } } },
      {
        $group: {
          _id: "$customer",
          totalSpent: { $sum: "$totalAmount" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      { $unwind: "$customerInfo" },
      {
        $project: {
          _id: 1,
          totalSpent: 1,
          ordersCount: 1,
          name: "$customerInfo.name",
          phone: "$customerInfo.phone",
        },
      },
    ]);

    // 7. Chart Data: Sales vs Purchase for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Grouping sales by date (YYYY-MM-DD)
    const recentSales = await Sales.aggregate([
      { $match: { date: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Grouping purchases by date (YYYY-MM-DD)
    const recentPurchases = await Purchase.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Merge chart data by date
    const chartDataMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      chartDataMap[dateStr] = { date: dateStr, sales: 0, purchases: 0 };
    }

    recentSales.forEach((s) => {
      if (chartDataMap[s._id]) chartDataMap[s._id].sales = s.amount;
    });
    recentPurchases.forEach((p) => {
      if (chartDataMap[p._id]) chartDataMap[p._id].purchases = p.amount;
    });

    const chartData = Object.values(chartDataMap);

    // 8. Notifications: Low Stock Alerts
    // threshold: totalBuyingUnits < 10
    const lowStockItems = await Inventory.find({ totalBuyingUnits: { $lt: 10 } })
      .select("productName sku totalBuyingUnits")
      .limit(10);

    const notifications = lowStockItems.map((item) => ({
      id: item._id,
      title: "Low Stock Alert",
      message: `${item.productName} needs to be reordered. Current stock: ${item.totalBuyingUnits} units.`,
      type: "warning",
      date: new Date(),
    }));

    res.status(200).json({
      success: true,
      data: {
        cards: {
          customersCount,
          // productsCount,
          purchaseAmount,
          salesAmount,
          profitLoss,
          stockAmount,
        },
        topProducts,
        topCustomers,
        chartData,
        notifications,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
