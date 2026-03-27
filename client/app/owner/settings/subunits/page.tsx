"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import CreateSubUnit from "./create-subunit"
import SubUnitsTable from "./subunits-table"

interface SubUnit {
  _id: string
  name: string
  shortName: string
}

const SubUnits = () => {
  const [subUnits, setSubUnits] = useState<SubUnit[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchSubUnits = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/subunits`)
      setSubUnits(data.subUnits || [])
    } catch(err:any) {
      if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to load subunits")
      throw err;
    } finally {
      setLoading(false)
    }
  }

  const createSubUnit = async (data:any) => {
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/subunits`, data)
    
    toast.success(res.data.message)
    fetchSubUnits()
  } catch (err: any) {
    if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to create subunit")
    throw err;
  }
}

  const editSubUnit = async (id: string, data: any) => {
  try {
    const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/subunits/${id}`, data)

    toast.success(res.data.message)

    fetchSubUnits()
  } catch (err: any) {
    if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to update subunit")
    throw err;
  }
}

  const deleteSubUnit = async (id: string) => {
  try {
    const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/subunits/${id}`)

    toast.success(res.data.message)

    fetchSubUnits()
  } catch (err: any) {
    if (err?.response?.status !== 403) toast.error(err.response?.data?.message || "Failed to delete subunit")
    throw err;
  }
}

  useEffect(() => {
    fetchSubUnits()
  }, [])

  return (
    <div className="space-y-4">
      <CreateSubUnit createSubUnit={createSubUnit} />

      <SubUnitsTable
        subUnits={subUnits}
        editSubUnit={editSubUnit}
        deleteSubUnit={deleteSubUnit}
        loading={loading}
      />
    </div>
  )
}

export default SubUnits