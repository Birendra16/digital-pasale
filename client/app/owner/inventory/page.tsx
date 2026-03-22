"use client"
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {io as ClientIO} from "socket.io-client";

const socket = ClientIO("http://localhost:8080");

export default function Inventory(){
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInventory = async ()=>{
    try{
      const res = await axios.get("http://localhost:8080/api/inventory");
      setInventory(res.data.products || []);
    } catch (error){
      console.error("Failed to fetch inventory", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchInventory();

    // Listen for real-time updates
  socket.on("inventoryUpdated", fetchInventory);
  return () => socket.off("inventoryUpdated");
  }, []);

  const filtered = useMemo(
    ()=> inventory.filter((p)=>p.productName.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())),
    [inventory, search]
  );

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Inventory</h1>
      <Input placeholder="Search by Name or SKU" value={search} onChange={(e)=> setSearch(e.target.value)} className="max-w-sm" />
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock(Units)</TableHead>
            <TableHead>Stock(SubUnits)</TableHead>
            <TableHead>Last Cost Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((p, i)=>(
            <TableRow key={i} className={p.totalBuyingUnits < 10 ? "bg-red-50" : ""}>
              <TableCell>{p.productName}</TableCell>
              <TableCell>{p.sku}</TableCell>
              <TableCell>{p.totalBuyingUnits}</TableCell>
              <TableCell>{p.totalSubUnits}</TableCell>
              <TableCell> Rs. {p.lastCostPrice} </TableCell>
            </TableRow>
          )
        )
        }
        </TableBody>
      </Table>

    </div>
  )
}