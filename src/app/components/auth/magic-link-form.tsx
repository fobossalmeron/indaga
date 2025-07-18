"use client"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"

interface MagicLinkFormProps {
  mode: "login" | "register"
  onSubmit: (email: string, fullName?: string) => Promise<void>
  isLoading: boolean
}

export function MagicLinkForm({ mode, onSubmit, isLoading }: MagicLinkFormProps) {
  const [email, setEmail] = useState("")
  const [fullName, setFullName] = useState("")
  const [errors, setErrors] = useState<{ email?: string; fullName?: string }>({})

  const validateForm = () => {
    const newErrors: { email?: string; fullName?: string } = {}
    
    if (!email) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }
    
    if (mode === "register" && !fullName.trim()) {
      newErrors.fullName = "El nombre completo es requerido"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    try {
      await onSubmit(email, mode === "register" ? fullName : undefined)
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {mode === "register" && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre completo
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Tu nombre completo"
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
      )}
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="tu@correo.com"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading 
          ? "Enviando..." 
          : mode === "register" 
            ? "Crear cuenta"
            : "Iniciar sesión"
        }
      </Button>

      <div className="text-sm text-gray-600 text-center">
        {mode === "register" 
          ? "Te enviaremos un enlace mágico para crear tu cuenta"
          : "Te enviaremos un enlace mágico para iniciar sesión"
        }
      </div>
    </form>
  )
}