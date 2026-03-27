"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, Mail, User, Edit, Key, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { useState } from "react"
import EditStaff from "./EditStaff"

interface StaffMember {
  _id: string;
  name: string;
  email: string;
  showPassword?: string;
  role: string;
  status: string;
}

interface StaffTableProps {
  staff: StaffMember[];
  loading: boolean;
  onDeleted: () => void;
  onUpdated: () => void;
}

export default function StaffTable({ staff, loading, onDeleted, onUpdated }: StaffTableProps) {
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete staff member "${name}"?`)) return;
    
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/staff/${id}`);
      toast.success(`${name} has been removed successfully`);
      onDeleted();
    } catch (err) {
      toast.error("Failed to delete staff member");
    }
  };

  const handleEditClick = (member: StaffMember) => {
    setEditingStaff(member);
    setEditOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg border border-gray-100" />
        ))}
      </div>
    );
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50/50">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No staff members found.</p>
        <p className="text-gray-400 text-sm mt-1">Add your first staff member to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border shadow-sm overflow-hidden bg-white">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-700">Staff Member</TableHead>
              <TableHead className="font-semibold text-gray-700">Email Address</TableHead>
              <TableHead className="font-semibold text-gray-700">Password</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member._id} className="hover:bg-gray-50/50 transition-all border-b last:border-0">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{member.name}</p>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-500">{member.role}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{member.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-50 px-2 py-1 rounded border border-orange-100 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-sm font-mono font-medium text-orange-700">
                        {member.showPassword || "••••••••"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 w-fit">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold uppercase tracking-tight">{member.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-blue-100 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                      onClick={() => handleEditClick(member)}
                      title="Edit Staff"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDelete(member._id, member.name)}
                      title="Delete Staff"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditStaff 
        staff={editingStaff} 
        open={editOpen} 
        setOpen={setEditOpen} 
        onUpdated={onUpdated} 
      />
    </>
  );
}
