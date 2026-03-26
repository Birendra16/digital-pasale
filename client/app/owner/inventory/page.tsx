"use client"

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";

// -----------------------------
// Product type
type Product = {
  _id: string;
  productName: string;
  sku: string;
  totalBuyingUnits: number;
  totalSubUnits: number;
  lastCostPrice: number;
};

// -----------------------------
// Product Row Component
function ProductRow({ product }: { product: Product }) {
  return (
    <TableRow
      key={product._id}
      className={`${
        product.totalBuyingUnits < 10 ? "bg-red-50 text-red-800 font-semibold" : ""
      }`}
    >
      <TableCell>{product.productName}</TableCell>
      <TableCell>{product.sku}</TableCell>
      <TableCell className="text-right">
        {product.totalBuyingUnits}
        {product.totalBuyingUnits < 10 && (
          <span
            className="ml-2 px-2 py-1 text-xs rounded bg-red-600 text-white"
            title="Low Stock"
          >
            Low
          </span>
        )}
      </TableCell>
      <TableCell className="text-right">{product.totalSubUnits}</TableCell>
      <TableCell className="text-right">Rs. {product.lastCostPrice}</TableCell>
    </TableRow>
  );
}

// -----------------------------
// Skeleton Row Component
function SkeletonRow() {
  return (
    <TableRow>
      {[...Array(5)].map((_, i) => (
        <TableCell key={i} className="py-2">
          <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
        </TableCell>
      ))}
    </TableRow>
  );
}

// -----------------------------
// Main Inventory Page
export default function Inventory() {
  const [inventory, setInventory] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof Product>("productName");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // -----------------------------
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // -----------------------------
  // Fetch inventory
  const fetchInventory = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`);
      setInventory(res.data.products || []);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // Socket.IO
  useEffect(() => {
    if (typeof window === "undefined") return;

    const { io } = require("socket.io-client");
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
    });

    socket.on("inventoryUpdated", (updatedProduct: Product) => {
      setInventory((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
      );
    });

    socket.on("connect_error", (err: any) => {
      console.error("Socket connection error:", err);
    });

    fetchInventory();

    return () => {
      socket.disconnect();
    };
  }, []);

  // -----------------------------
  // Filtered list
  const filtered = useMemo(
    () =>
      inventory.filter(
        (p) =>
          p.productName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(debouncedSearch.toLowerCase())
      ),
    [inventory, debouncedSearch]
  );

  // -----------------------------
  // Sorted list
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortOrder]);

  // -----------------------------
  // Paginated list
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sorted.slice(start, start + itemsPerPage);
  }, [sorted, currentPage]);

  // -----------------------------
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Inventory ({filtered.length})</h1>

      <Input
        placeholder="Search by Name or SKU"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table className="overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => {
                setSortKey("productName");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className="cursor-pointer"
            >
              Name
            </TableHead>
            <TableHead
              onClick={() => {
                setSortKey("sku");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className="cursor-pointer"
            >
              SKU
            </TableHead>
            <TableHead
              onClick={() => {
                setSortKey("totalBuyingUnits");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className="cursor-pointer text-right"
            >
              Stock(Units)
            </TableHead>
            <TableHead className="text-right">Stock(SubUnits)</TableHead>
            <TableHead
              onClick={() => {
                setSortKey("lastCostPrice");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
              className="cursor-pointer text-right"
            >
              Last Cost Price
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? [...Array(itemsPerPage)].map((_, i) => <SkeletonRow key={i} />)
            : paginated.length === 0
            ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No products found
                </TableCell>
              </TableRow>
            )
            : paginated.map((p) => <ProductRow key={p._id} product={p} />)}
        </TableBody>
      </Table>

      {/* Pagination controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(filtered.length / itemsPerPage)}
        </span>
        <button
          disabled={currentPage === Math.ceil(filtered.length / itemsPerPage)}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}