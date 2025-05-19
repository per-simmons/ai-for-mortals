import { getPostBySlug, getAllPosts, markdownToHtml } from "@/lib/api"
import Link from "next/link"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found | AI For Mortals Blog",
    }
  }

  return {
    title: `${post.title} | AI For Mortals Blog`,
    description: post.excerpt,
    openGraph: {
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  const content = await markdownToHtml(post.content || "")

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/blog" className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all posts
        </Link>

        <article className="overflow-hidden rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
          <header className="mb-8">
            <div className="mb-2 text-sm text-gray-500">{post.formattedDate}</div>
            <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">{post.title}</h1>
            {post.author && <div className="text-gray-600">By {post.author}</div>}
          </header>

          {post.coverImage && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          )}

          <div className="blog-content prose max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </div>
  )
}
