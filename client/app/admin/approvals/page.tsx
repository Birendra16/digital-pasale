"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

// shadcn table
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

export default function ApprovalsPage() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/pending-users",
        { withCredentials: true }
      );
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to fetch users");
    }
  };

  const approveUser = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/approve-user/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("User approved ✅");
      fetchUsers();
    } catch (err) {
      toast.error("Approval failed");
    }
  };

  const rejectUser = async (id: string) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/reject-user/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success("User rejected ❌");
      fetchUsers();
    } catch (err) {
      toast.error("Reject failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">User Approvals</h1>
        <p className="text-gray-500">Manage pending users</p>
      </div>

      {/* Table */}
      <div className="border rounded-xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No pending users 
                </TableCell>
              </TableRow>
            ) : (
              users.map((user: any) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="text-yellow-600 font-medium">
                      PENDING
                    </span>
                  </TableCell>

                  <TableCell className="text-right space-x-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => approveUser(user._id)}
                    >
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => rejectUser(user._id)}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}