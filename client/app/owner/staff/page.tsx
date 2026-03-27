"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import CreateStaff from "./CreateStaff";
import StaffTable from "./StaffTable";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/staff`);
      setStaff(res.data);
    } catch (err) {
      toast.error("Failed to fetch staff members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
          <p className="text-gray-500 text-sm">Create and manage your shop staff accounts.</p>
        </div>

        <CreateStaff onCreated={fetchStaff} />
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <StaffTable staff={staff} loading={loading} onDeleted={fetchStaff} onUpdated={fetchStaff} />
      </div>
    </div>
  );
}
