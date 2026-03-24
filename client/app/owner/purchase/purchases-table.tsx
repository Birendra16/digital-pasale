"use client";

import React, { Fragment } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface PurchasesTableProps {
  purchases: any[];
  loading?: boolean;
  onRefresh?: () => void; // optional callback for refreshing
}

export default function PurchasesTable({ purchases, loading, onRefresh }: PurchasesTableProps) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="space-y-4 bg-white rounded-md border border-t-0 p-0 overflow-hidden">

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Supplier</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex justify-center p-4">Loading purchases...</div>
              </TableCell>
            </TableRow>
          ) : purchases?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                No purchases found
              </TableCell>
            </TableRow>
          ) : (
            purchases?.map((p) => (
              <Fragment key={p._id}>
                {/* Main Row */}
                <TableRow>
                  <TableCell>{p.supplierId?.name || "Unknown"}</TableCell>
                  <TableCell>{new Date(p.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">Rs. {p.totalAmount}</TableCell>
                  <TableCell>{p.items?.length || 0}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleExpand(p._id)}
                    >
                      {expanded === p._id ? "Hide" : "View"}
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Expanded Row */}
                {expanded === p._id && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/50 p-0">
                      <div className="border-l-4 border-blue-500 rounded-r-lg p-4 space-y-3">
                        <h3 className="font-semibold">Items</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Product</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Qty</TableHead>
                              <TableHead>Capacity</TableHead>
                              <TableHead>Cost</TableHead>
                              <TableHead>Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(p.items || []).map((item: any, i: number) => (
                              <TableRow key={i}>
                                <TableCell>{item.productName}</TableCell>
                                <TableCell>{item.sku}</TableCell>
                                <TableCell>{item.buyingQuantity}</TableCell>
                                <TableCell>{item.unitCapacity}</TableCell>
                                <TableCell>Rs. {item.costPricePerUnit}</TableCell>
                                <TableCell>Rs. {item.totalCost}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}