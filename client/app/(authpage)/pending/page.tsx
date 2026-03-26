"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl text-center">
        <CardHeader className="flex flex-col items-center">
          <Info className="w-12 h-12 text-indigo-500 mb-2" />
          <CardTitle className="text-2xl font-bold text-gray-800">
            Account Pending Approval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your account is currently awaiting admin approval. 
            You will be notified once your account is active. 
            Thank you for your patience.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}