"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import CreateUnit from "./create-unit"
import UnitsTable from "./units-table"

interface Unit {
  _id: string
  name: string
  symbol: string
  isFractional: boolean
}

const Units = () => {
  const [units, setUnits] = useState<Unit[]>([])

  const fetchUnits = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/units")
      setUnits(data.units)
    } catch {
      toast.error("Failed to load units")
    }
  }

  // Create Unit
  const createUnit = async (unitInfo: any) => {
    try {
      await axios.post("http://localhost:8080/api/units", unitInfo)
      toast.success("Unit created successfully")
      fetchUnits()
    } catch {
      toast.error("Failed to create unit")
    }
  }

  // Edit Unit
  const editUnit = async (id: string, unitInfo: any) => {
    try {
      await axios.put(`http://localhost:8080/api/units/${id}`, unitInfo)
      toast.success("Unit updated successfully")
      fetchUnits()
    } catch {
      toast.error("Failed to update unit")
    }
  }

  // Delete Unit
  const deleteUnit = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/units/${id}`)
      toast.success("Unit deleted successfully")
      fetchUnits()
    } catch {
      toast.error("Failed to delete unit")
    }
  }

  useEffect(() => {
    fetchUnits()
  }, [])

  return (
    <div className="space-y-4">
      <CreateUnit createUnit={createUnit} />

      <UnitsTable
        units={units} 
        editUnit={editUnit}
        deleteUnit={deleteUnit}
      />
    </div>
  )
}

export default Units