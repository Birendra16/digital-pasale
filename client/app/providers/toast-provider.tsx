"use client"

import { Toaster } from "sonner"

export default function ToastProviders() {
  return (
    <Toaster
      position="top-right"
      richColors
      expand
      closeButton
      toastOptions={{
        style: {
          zIndex: 9999,
          pointerEvents: "auto",
        },
      }}
    />
  )
}