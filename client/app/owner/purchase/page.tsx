"use client"

import PurchasesTable from "./purchases-table"

export default function PurchasesPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Purchases</h1>
      <p className="text-sm text-muted-foreground">
        Record incoming stock from suppliers. You can view all purchase details and process returns.
      </p>

      <PurchasesTable />
    </div>
  )
}