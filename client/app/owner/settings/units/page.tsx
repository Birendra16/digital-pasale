"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import CreateUnit from "./create-unit"
import UnitsTable from "./units-table"

interface Unit {
  _id: string
  name: string
  shortName: string
}

const Units = () => {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUnits = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/units`)
      setUnits(data.units || [])
    } catch(err:any) {
      if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to load units")
      throw err;
    } finally {
      setLoading(false)
    }
  }

  const createUnit = async (unitInfo: any) => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, unitInfo)
      toast.success(res.data.message)
      fetchUnits()
    } catch(err:any) {
    if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to create unit")
        throw err;
    }
  }

  const editUnit = async (id: string, unitInfo: any) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${id}`, unitInfo)
      toast.success(res.data.message)
      fetchUnits()
    } catch(err:any) {
    if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to update unit")
    throw err;
    }
  }

  const deleteUnit = async (id: string) => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/units/${id}`)
    toast.success(res.data.message)
      fetchUnits()
    } catch (err:any){
    if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to delete unit")
    throw err;
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
        loading={loading}
        editUnit={editUnit}
        deleteUnit={deleteUnit}
      />
    </div>
  )
}

export default Units