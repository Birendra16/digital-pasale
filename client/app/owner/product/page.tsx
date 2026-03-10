'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'
import CreateProducts from './create-products'
import ProductsTable from './products-table'
import { toast } from 'sonner'

const Products = () => {
  const [products, setProducts] = useState<any[] | null> (null)
  const [isloading, setIsLoading] = useState(true)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
    const { data } = await axios.get("http://localhost:8080/api/products")
    setProducts(data.products)
    } catch {
      toast("Failed to load products")
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  const createProduct = async (productInfo: any) => {
    try {
    await axios.post("http://localhost:8080/api/products", productInfo)
    await fetchProducts();
    } catch {
      toast("Failed to create product")
    }
  }

  const editProduct = async (id: string, productInfo: any) => {
    try {
    await axios.put(`http://localhost:8080/api/products/${id}`, productInfo)
    await fetchProducts();
    } catch {
      toast("Failed to update product")
    }
  }

  const deleteProduct = async (id: string) => {
    try {
    await axios.delete(`http://localhost:8080/api/products/${id}`)
    await fetchProducts();
    } catch {
      toast("Failed to delete product")
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="space-y-4">
      <CreateProducts createProduct={createProduct} />
      <ProductsTable
        products={products ?? []}
        isLoading={isloading}
        deleteProduct={deleteProduct}
        editProduct={editProduct}
      />
    </div>
  )
}

export default Products