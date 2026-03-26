"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Charts
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  pending: number;
  active: number;
  rejected: number;
}

interface ChartData {
  date: string;
  count: number;
}

const AdminDashboard = () => {
  const router = useRouter();

  const [stats, setStats] = useState<Stats>({
    pending: 0,
    active: 0,
    rejected: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // AUTH HEADER (TOKEN)
  const getAuthHeader = () => {
    const token = localStorage.getItem("TOKEN");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // PROTECT ROUTE
  useEffect(() => {
    const user = localStorage.getItem("USER");

    if (!user) {
      router.push("/login");
      return;
    }

    const parsed = JSON.parse(user);

    if (parsed.role !== "ADMIN") {
      router.push("/");
      return;
    }

    // load data
    fetchStats();
    fetchChart();
  }, []);

  // FETCH STATS
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard-stats`,
        getAuthHeader()
      );
      setStats(res.data);
    } catch {
      toast.error("Unauthorized - please login again");
      router.push("/login");
    }
  };

  // FETCH CHART
  const fetchChart = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/daily-signups`,
        getAuthHeader()
      );
      setChartData(res.data);
    } catch {
      toast.error("Failed to load chart data");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">Overview of your users</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Pending Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <Link href="/admin/approvals">
              <Button className="mt-2 w-full bg-yellow-600 hover:bg-yellow-700">
                View All Approvals
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Active Owners</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md rounded-xl">
          <CardHeader>
            <CardTitle>Rejected Users</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>Daily Signups (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4ade80" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;