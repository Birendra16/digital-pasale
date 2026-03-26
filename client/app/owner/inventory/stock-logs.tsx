import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const StockLogsModal = ({item, close}: {item: any; close: any}) => {
  const [logs, setLogs] = useState<any[]>([])

  const fetchLogs = async ()=>{
    
    const {data} = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/inventory/logs/${item._id}`
    )
    setLogs(data.logs)
  };

  useEffect(()=>{
    fetchLogs();
  },[])

  return (
    <Dialog open={true} onOpenChange={close}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stock Logs - {item.product?.name}</DialogTitle>
        </DialogHeader>

        <Table className="mt-2">

          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>In</TableHead>
              <TableHead>Out</TableHead>
              <TableHead>Damaged</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.date.substring(0, 10)}</TableCell>
                <TableCell>{log.movementType}</TableCell>
                <TableCell>{log.quantityIn}</TableCell>
                <TableCell>{log.quantityOut}</TableCell>
                <TableCell>{log.damaged}</TableCell>
                <TableCell>{log.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>

        </Table>

        <DialogFooter className="mt-4 flex justify-end">
          <Button onClick={close}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default StockLogsModal