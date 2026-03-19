"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import CreateSubUnit from "./create-subunit"
import SubUnitsTable from "./subunits-table"

interface SubUnit {
  _id: string
  name: string
  symbol: string
  isFractional: boolean
}

const SubUnits = () => {
  const [SubUnits, setSubUnits] = useState<Unit[]>([])

  const fetchSubUnits = async () => {
    try {
      const { data } = await axios.get("http://localhost:8080/api/SubUnits")
      setSubUnits(data.SubUnits)
    } catch {
      toast.error("Failed to load SubUnits")
    }
  }

  // Create Unit
  const createUnit = async (unitInfo: any) => {
    try {
      await axios.post("http://localhost:8080/api/SubUnits", unitInfo)
      toast.success("Unit created successfully")
      fetchSubUnits()
    } catch {
      toast.error("Failed to create unit")
    }
  }

  // Edit Unit
  const editUnit = async (id: string, unitInfo: any) => {
    try {
      await axios.put(`http://localhost:8080/api/SubUnits/${id}`, unitInfo)
      toast.success("Unit updated successfully")
      fetchSubUnits()
    } catch {
      toast.error("Failed to update unit")
    }
  }

  // Delete Unit
  const deleteUnit = async (id: string) => {
    try {
      await axios.delete(`http://localhost:8080/api/SubUnits/${id}`)
      toast.success("Unit deleted successfully")
      fetchSubUnits()
    } catch {
      toast.error("Failed to delete unit")
    }
  }

  useEffect(() => {
    fetchSubUnits()
  }, [])

  return (
    <div className="space-y-4">
      <CreateUnit createUnit={createUnit} />

      <SubUnitsTable
        SubUnits={SubUnits} 
        editUnit={editUnit}
        deleteUnit={deleteUnit}
      />
    </div>
  )
}

export default SubUnits