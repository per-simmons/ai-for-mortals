"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SubscribeModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  // Handle modal animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      window.addEventListener("keydown", handleEsc)
    }

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [isOpen, onClose])

  // Use the same subscription function as the main form
  async function subscribeUser(email: string) {
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to subscribe")
    }

    return response.json()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email) {
      setErrorMessage("Please enter your email address")
      setSubmitStatus("error")
      return
    }

    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address")
      setSubmitStatus("error")
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitStatus(null)

      await subscribeUser(email)

      // Success state
      setSubmitStatus("success")
      setEmail("")

      // Close modal after successful subscription after a delay
      setTimeout(() => {
        onClose()
        setSubmitStatus(null)
      }, 3000)
    } catch (error) {
      console.error("Subscription error:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div
        className="relative mx-4 w-full max-w-2xl overflow-hidden rounded-xl bg-gradient-to-b from-black to-stone-900 p-10 shadow-2xl transition-all duration-300 ease-out"
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.95) translateY(10px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative elements */}
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-xl"></div>
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-tl from-blue-500/20 to-transparent blur-xl"></div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 text-white/70 hover:bg-white/10 hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>

        <div className="mb-10 text-center text-white">
          <h2 className="mb-4 font-serif text-5xl font-bold tracking-wider md:text-6xl">AI FOR MORTALS</h2>
          <p className="mx-auto max-w-lg text-lg text-white/80">
            Simple AI skills that will make everyone wonder how you do it all.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-6">
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <div className="relative flex-grow">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-14 flex-grow rounded-lg border-transparent bg-white/10 pl-5 pr-10 text-lg text-white placeholder:text-white/50 focus:border-white/30 focus-visible:ring-1 focus-visible:ring-white/30"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (submitStatus === "error") setSubmitStatus(null)
                }}
                required
                disabled={isSubmitting}
                aria-invalid={submitStatus === "error"}
              />
              {email && (
                <div className="absolute right-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-amber-500"></div>
              )}
            </div>
            <Button
              type="submit"
              className="h-14 min-w-14 rounded-lg bg-white/10 px-5 text-white backdrop-blur-sm hover:bg-white/20 disabled:opacity-50"
              aria-label="Subscribe"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : submitStatus === "success" ? (
                <Check className="h-5 w-5" />
              ) : (
                <ArrowRight className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Status messages */}
          {submitStatus === "success" && (
            <div className="text-center text-sm text-green-400 transition-opacity duration-300">
              Thank you for subscribing! Check your email for a welcome message.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="text-center text-sm text-red-400 transition-opacity duration-300">{errorMessage}</div>
          )}

          {/* Updated text below the email CTA */}
          <p className="text-center text-base text-white/60">
            AI tools, tips, and tutorials in plain English. Delivered every week.
          </p>
        </form>
      </div>
    </div>
  )
}
