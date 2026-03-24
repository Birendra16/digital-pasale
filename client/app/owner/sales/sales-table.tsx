"use client";

import { Fragment, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function SalesTable({ sales, loading }: any) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex justify-center p-4">Loading sales...</div>
              </TableCell>
            </TableRow>
          ) : sales?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center p-4">
                No sales found
              </TableCell>
            </TableRow>
          ) : (
            sales?.map((s: any) => (
              <Fragment key={s._id}>
                <TableRow>
                  <TableCell>{s.customer?.name || "Walk-in"}</TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>Rs. {s.totalAmount}</TableCell>
                  <TableCell>{s.items?.length || 0}</TableCell> 
                  <TableCell>
                    <Button onClick={() => setExpanded(expanded === s._id ? null : s._id)}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>

                {expanded === s._id && (
                  <TableRow>
                    <TableCell colSpan={5} className="bg-muted/50">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Units</TableHead>
                            <TableHead>SubUnits</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {(s.items || []).map((i: any, idx: number) => (
                            <TableRow key={idx}>
                              <TableCell>{i.productName}</TableCell>
                              <TableCell>{i.unitQuantity}</TableCell>
                              <TableCell>{i.subUnitQuantity}</TableCell>
                              <TableCell>{i.totalAmount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}