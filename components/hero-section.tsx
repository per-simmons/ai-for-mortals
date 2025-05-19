"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SubscribeModal from "./subscribe-modal"
import { useIsMobile } from "@/hooks/use-mobile"

export default function HeroSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const isMobile = useIsMobile()

  // Updated to use our own API route instead of calling Loops.so directly
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

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 5000)
    } catch (error) {
      console.error("Subscription error:", error)
      setSubmitStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Sorry, something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Top navigation buttons */}
      <div className="absolute right-8 top-8 z-20 flex space-x-4 md:right-16 md:top-12">
        <Link href="/blog">
          <Button variant="outline" className="rounded-none border-2 bg-white text-black hover:bg-white/90">
            Blog
          </Button>
        </Link>
        <Link href="/letter-to-mortals">
          <Button variant="outline" className="rounded-none border-2 bg-white text-black hover:bg-white/90">
            A Letter To Mortals
          </Button>
        </Link>
        <Button className="rounded-none bg-black text-white hover:bg-black/90" onClick={() => setIsModalOpen(true)}>
          Subscribe
        </Button>
      </div>

      {/* Subscribe Modal */}
      <SubscribeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Background image with enhanced zoom animation */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 animate-slow-zoom">
          <img
            src="/images/hero-background.png"
            alt="Renaissance painting with modern digital elements"
            className="h-full w-full object-cover"
            style={{
              objectPosition: isMobile ? "45% center" : "center 40%",
            }}
          />
        </div>
        {/* Dark gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col justify-center px-4 text-white">
        <div className={`${isMobile ? "ml-4 mr-4" : "ml-8 md:ml-16 lg:ml-24"} max-w-xl`}>
          {/* Small header text */}
          <div className="mb-2 font-serif text-sm tracking-wider opacity-80">PRACTICAL AI FOR EVERYDAY PEOPLE</div>

          {/* Headline with light sweep animation */}
          <h1
            className={`animate-light-sweep mb-6 font-serif font-bold tracking-wider ${
              isMobile ? "text-5xl" : "text-6xl md:text-8xl"
            }`}
          >
            AI FOR
            <br className={isMobile ? "block" : "hidden"} /> MORTALS.
          </h1>

          {/* Subheadline with fade-in animation and line breaks */}
          <p
            className={`animate-fade-in mb-8 max-w-md opacity-0 ${
              isMobile ? "text-lg leading-snug" : "text-xl leading-tight md:text-2xl"
            }`}
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            Simple AI skills that will make everyone
            <br />
            wonder how you do it all.
          </p>

          {/* Email form with fade-in animation */}
          <form
            id="subscribe-form"
            onSubmit={handleSubmit}
            className="animate-fade-in mb-4 flex w-full max-w-md flex-col space-y-3 opacity-0 sm:flex-row sm:space-x-3 sm:space-y-0"
            style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
          >
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-12 flex-grow rounded-md border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:ring-white/30"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (submitStatus === "error") setSubmitStatus(null)
              }}
              required
              disabled={isSubmitting}
              aria-invalid={submitStatus === "error"}
            />
            <Button
              type="submit"
              className="h-12 rounded-md bg-white/20 px-4 text-white hover:bg-white/30 disabled:opacity-50"
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
          </form>

          {/* Status messages */}
          {submitStatus === "success" && (
            <div className="mb-4 text-sm text-green-400 transition-opacity duration-300">
              Thank you for subscribing! Check your email for a welcome message.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="mb-4 text-sm text-red-400 transition-opacity duration-300">{errorMessage}</div>
          )}

          {/* Updated text below the email CTA */}
          <p className={`max-w-md opacity-80 ${isMobile ? "text-xs" : "text-sm"}`}>
            AI tools, tips, and tutorials in plain English. Delivered every week.
          </p>
        </div>
      </div>
    </div>
  )
}
