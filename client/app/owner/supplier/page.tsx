"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import CreateSupplier from "./create-supplier"
import SuppliersTable from "./suppliers-table" 

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchSuppliers = async () => {
    setIsLoading(true)
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/suppliers"
      )
      setSuppliers(data.suppliers)
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to fetch suppliers"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  return (
    <div className="p-4 space-y-4"> {/* ✅ IMPROVED spacing */}
      
      {/* 🔹 Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Suppliers</h1>

        {/* ✅ Create Button */}
        <CreateSupplier fetchSuppliers={fetchSuppliers} />
      </div>

     
      {isLoading ? (
        <p className="text-center">Loading suppliers...</p> 
      ) : (
        <SuppliersTable
          suppliers={suppliers}
          fetchSuppliers={fetchSuppliers} 
        />
      )}
    </div>
  )
}

export default Suppliers