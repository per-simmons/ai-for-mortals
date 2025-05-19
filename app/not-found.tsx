import Link from "next/link"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mb-6 text-2xl font-medium text-gray-600">Page Not Found</h2>
      <p className="mb-8 max-w-md text-gray-500">The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/" className="rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800">
        Go back home
      </Link>
    </div>
  )
}
