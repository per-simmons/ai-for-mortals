import Link from "next/link"
import { getAllPosts } from "@/lib/api"

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="mb-3 text-5xl font-extrabold text-gray-900 tracking-tight">AI For Mortals Blog</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Insights and perspectives on artificial intelligence for everyone</p>
        </header>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center shadow-md">
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M9 15L5 11m0 0l4-4m-4 4h14" />
              </svg>
              <p className="text-xl font-medium text-gray-600">No blog posts found. Check back soon!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-gray-300">
                <div className="aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={post.coverImage || "/placeholder.svg"}
                    alt={post.title}
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    {post.formattedDate}
                  </div>
                  <h2 className="mb-4 text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                    <Link href={`/blog/${post.slug}`} className="block">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mb-5 text-gray-600 line-clamp-3">{post.excerpt}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    Read article
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
