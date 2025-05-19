"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LetterToMortals() {
  const contentRef = useRef<HTMLDivElement>(null)

  // Paragraph reveal animation on page load
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start the animation sequence once the container is visible
            animateParagraphs()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (contentRef.current) {
      observer.observe(contentRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const animateParagraphs = () => {
    const paragraphs = document.querySelectorAll(".reveal-paragraph")

    paragraphs.forEach((paragraph, index) => {
      setTimeout(
        () => {
          paragraph.classList.add("revealed")
        },
        300 + index * 200,
      ) // Start after 300ms, then 200ms between paragraphs
    })
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8">
      {/* Back button */}
      <div className="container mx-auto px-4">
        <Link href="/">
          <Button variant="ghost" className="mb-8 rounded-none text-stone-800 hover:bg-stone-200/50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>

      {/* Letter container with parchment background */}
      <div className="mx-auto max-w-[750px]">
        <div ref={contentRef} className="bg-parchment bg-cover bg-center px-8 py-12 shadow-deep md:px-16 md:py-20">
          <h1 className="reveal-paragraph mb-12 font-serif text-4xl font-bold text-stone-800 opacity-0 transition-all duration-700 md:text-5xl">
            Dear Mortal,
          </h1>

          <div className="prose prose-lg max-w-none font-typewriter text-stone-800">
            <p className="reveal-paragraph opacity-0 transition-all duration-700">The year is 2025.</p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              There's a Mt. Vesuvius-level eruption impending at our very feet. Its oozing hot lava is destined to cover
              our jobs, our personal lives, the content we create, and the decisions we make. No corner of our existence
              shall remain untouched by this molten force.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              The tremors have already begun. Many respond with fear—clinging to old ways of working.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              But here's the truth: the eruption is inevitable. We can already see the smoke rising, feel the ground
              warming beneath our feet with each new tool and capability emerging daily.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              But what if I told you there's another option?
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              I've spent years obsessed with understanding this new world, not as a programmer or data scientist. I have
              no technical background, no formal training in the arcane arts of machine learning. My expertise is in
              being exactly like you: a mortal trying to make sense of seemingly immortal technology.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              This community—AI for Mortals—is my sanctuary of practical knowledge. A place where you'll find
              step-by-step tutorials and templates. I'll show you how to:
            </p>

            <ul className="reveal-paragraph list-none opacity-0 transition-all duration-700">
              <li>Create marketing automations that work while you sleep</li>
              <li>Streamline operations to eliminate repetitive tasks</li>
              <li>Accelerate content creation to produce more with less effort</li>
              <li>Transform your daily routines with simple AI enhancements</li>
              <li>Design workflows that save you hours every week</li>
              <li>Build software, websites, and tools without writing a single line of code</li>
            </ul>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              This isn't about theoretical discussions of neural networks.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">It's about Monday morning.</p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              It's about the project due next week and the career you're building.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              And for those projects and that career, I'll be your guide through this new landscape, offering actionable
              advice you can implement immediately to create better work with less effort.
            </p>

            <p className="reveal-paragraph opacity-0 transition-all duration-700">
              The AI revolution doesn't have to be something that happens to you. It can be something that happens for
              you.
            </p>

            <div className="reveal-paragraph mt-16 flex items-end opacity-0 transition-all duration-700">
              <div className="flex-1">
                <p className="mb-2 font-serif italic">Yours in mortal fellowship,</p>
                <div className="mb-2 h-16 w-48">
                  <p className="font-handwriting text-3xl">Pat Simmons</p>
                </div>
                <p className="text-sm text-stone-600">
                  (PerSimmons, my <em>nom de plume</em>)
                </p>
              </div>
              <div className="ml-4 h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-stone-200">
                <img
                  src="/images/author-portrait-cropped.jpeg"
                  alt="Pat Simmons portrait"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
