import Link from "next/link"
import type { ReactNode } from "react"

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <Link href="/" className="flex items-center">
            <img src="/favicon.png" alt="AI For Mortals Logo" className="h-10 w-auto" />
            <span className="ml-3 text-xl font-bold text-gray-900">AI For Mortals</span>
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/letter-to-mortals" className="text-gray-600 hover:text-gray-900">
                  Letter to Mortals
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} AI For Mortals. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
