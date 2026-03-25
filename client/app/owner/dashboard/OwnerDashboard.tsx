"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Package, TrendingUp, TrendingDown, DollarSign, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DashboardData {
  cards: { customersCount: number; purchaseAmount: number; salesAmount: number; profitLoss: number; stockAmount: number };
  topProducts: { _id: string; sku: string; totalRevenue: number; totalQuantitySold: number }[];
  topCustomers: { name: string; phone: string; totalSpent: number; ordersCount: number }[];
  chartData: { date: string; sales: number; purchases: number }[];
  notifications: { title: string; message: string; date: string }[];
}

export default function OwnerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/dashboard/metrics", { withCredentials: true });
      setData(res.data.data);
    } catch (err) { console.error("Error fetching dashboard metrics:", err); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center">Loading...</div>;
  if (!data) return <div className="text-red-500">Failed to load dashboard data</div>;

  const cards = [
    { title: "Total Sales", value: `Rs. ${data.cards.salesAmount.toLocaleString()}`, icon: <TrendingUp className="text-green-500" /> },
    { title: "Total Purchases", value: `Rs. ${data.cards.purchaseAmount.toLocaleString()}`, icon: <TrendingDown className="text-red-500" /> },
    { title: "Profit / Loss", value: `Rs. ${data.cards.profitLoss.toLocaleString()}`, icon: <DollarSign className={`${data.cards.profitLoss >= 0 ? "text-green-500" : "text-red-500"}`} /> },
    { title: "Total Stock Value", value: `Rs. ${data.cards.stockAmount.toLocaleString()}`, icon: <Package /> },
    { title: "Customers", value: data.cards.customersCount, icon: <Users /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((c, i) => (
          <Card key={i}>
            <CardHeader className="flex justify-between">
              <CardTitle className="text-sm">{c.title}</CardTitle>
              {c.icon}
            </CardHeader>
            <CardContent><p className="text-xl font-bold">{c.value}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Notifications Side-by-Side */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Chart Section */}
        <Card className="col-span-4">
          <CardHeader><CardTitle>Sales vs Purchases (Last 7 Days)</CardTitle></CardHeader>
          <CardContent>
            <div className="w-full h-[300px]">
              <LineChart width={800} height={300} data={data.chartData} style={{ width: "100%" }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(v) => `Rs.${v}`} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} />
                <Line type="monotone" dataKey="purchases" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" /> Notifications & Alerts
            </CardTitle>
            <CardDescription>Low stock items needing reorder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-[300px] overflow-y-auto">
              {data.notifications.length === 0 ? (
                <p className="text-center text-sm text-gray-500">No alerts at this time.</p>
              ) : (
                data.notifications.map((notif, i) => (
                  <div key={i} className="flex items-start gap-4 border p-3 rounded-lg bg-yellow-50">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <h4 className="text-sm font-semibold">{notif.title}</h4>
                      <p className="text-sm text-gray-600">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(notif.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Customers */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader><CardTitle>Top 5 Products</CardTitle><CardDescription>By quantity sold</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {data.topProducts.length === 0 ? <p className="text-center text-sm text-gray-500">No data</p> : data.topProducts.map((p, i) => (
              <div key={i} className="flex justify-between">
                <div><p className="font-medium">{p._id}</p><p className="text-sm text-gray-500">SKU: {p.sku}</p></div>
                <div className="text-right"><p className="font-medium">Rs. {p.totalRevenue?.toLocaleString()}</p><p className="text-sm text-gray-500">{p.totalQuantitySold} sold</p></div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader><CardTitle>Top 5 Customers</CardTitle><CardDescription>By amount spent</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {data.topCustomers.length === 0 ? <p className="text-center text-sm text-gray-500">No data</p> : data.topCustomers.map((c, i) => (
              <div key={i} className="flex justify-between">
                <div><p className="font-medium">{c.name}</p><p className="text-sm text-gray-500">{c.phone}</p></div>
                <div className="text-right"><p className="font-medium">Rs. {c.totalSpent?.toLocaleString()}</p><p className="text-sm text-gray-500">{c.ordersCount} orders</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}