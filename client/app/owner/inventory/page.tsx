"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axios from "axios"
import Fuse from "fuse.js"
import { ClipboardList, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import StockLogsModal from "./stock-logs"
import UpdateStockModal from "./update-stock"

const Inventory = () => {
const [inventory, setInventory] = useState([])
const [selected, setSelected] = useState(null)
const [showUpdate, setShowUpdate] = useState(false)
const [showLogs, setShowLogs] = useState(false)
const [search, setSearch] = useState("")
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10;

const fetchInventory = async ()=>{
  const {data} = await axios.get("http://localhost:8080/api/inventory")
  setInventory(data.inventory)
}

useEffect(()=>{
  fetchInventory()
},[])

// Fuse.js search
const fuse = new Fuse(inventory, {
  keys: ["product.name", "unit.name"],
  threshold: 0.3,
});

const filteredInventory = search
  ?fuse.search(search).map((res)=> res.item)
  :inventory;

const totalPages = Math.ceil(filteredInventory.length/itemsPerPage);
const paginatedInventory = filteredInventory.slice(
  (currentPage-1)*itemsPerPage,
  currentPage* itemsPerPage
);

  return (
   <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Inventory</h1>

    <Input
      placeholder="Search by product or unit..."
      value={search}
      onChange={(e)=>{setSearch(e.target.value); setCurrentPage(1);}}
      className="mb-4"
      />

      <Table>
  <TableHeader>
    <TableRow>
      <TableHead>Product</TableHead>
      <TableHead>Unit</TableHead>
      <TableHead>Quantity</TableHead>
      <TableHead>Damaged</TableHead>
      <TableHead>Expiry</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>

        <TableBody>
          {paginatedInventory.map((item)=>{
            const isLowStock = item.quantity <= item.lowStockThreshold;
            const today = new Date();
            const expiry = item.expiryDate ? new Date(item.expiryDate):null;
            const isExpiringSoon = expiry && (expiry - today) / (1000*60*60*24) <= 7;

            return(
              <TableRow key={item._id} className={`${isLowStock ? "bg-red-100": ""}`}>
                <TableCell>{item.product?.name}</TableCell>
                <TableCell>{item.unit?.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.damaged}</TableCell>
                <TableCell>
                  {item.expiryDate?.substring(0,10) || "-"} {" "}
                  {isExpiringSoon && <span className="text-yellow-600 font-bold">⚠ Expiring soon</span>}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={()=>{setSelected(item); setShowUpdate(true); }}>
                    <Edit size={16} /> Update
                  </Button>
                  <Button size="sm" variant="outline" onClick={()=>{setSelected(item); setShowLogs(true)}}>
                    <ClipboardList size={16} /> Logs
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* //Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <Button disabled={currentPage ===1} onClick={()=>setCurrentPage(prev=> prev -1)}>Prev</Button>
        <span>Page {currentPage}/{totalPages}</span>
        <Button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(prev => prev + 1)}>Next</Button>
      </div>

      {showUpdate && selected && (
        <UpdateStockModal
          item={selected}
          close={()=> setShowUpdate(false)}
          refresh={fetchInventory}
          />
      )}
      {showLogs && selected && (
        <StockLogsModal
        item={selected}
        close={()=> setShowLogs(false)}
        />
      )}
   </div>
  )
}

export default Inventory