'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import CreateProducts from './create-products'
import ProductsTable from './products-table'

const Products = () => {
  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    const { data } = await axios.get("http://localhost:8080/api/products")
    setProducts(data.products)
  }

  const createProduct = async (productInfo: any) => {
    await axios.post("http://localhost:8080/api/products", productInfo)
    fetchProducts()
  }

  const editProduct = async (id: string, productInfo: any) => {
    await axios.put(`http://localhost:8080/api/products/${id}`, productInfo)
    fetchProducts()
  }

  const deleteProduct = async (id: string) => {
    await axios.delete(`http://localhost:8080/api/products/${id}`)
    fetchProducts()
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="space-y-4">
      <CreateProducts createProduct={createProduct} />
      <ProductsTable
        products={products}
        deleteProduct={deleteProduct}
        editProduct={editProduct}
      />
    </div>
  )
}

export default Products