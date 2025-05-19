import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { unified } from "unified"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import { format } from "date-fns"

const postsDirectory = path.join(process.cwd(), "content/blog")

export type PostMetadata = {
  slug: string
  title: string
  date: string
  formattedDate: string
  excerpt: string
  coverImage?: string
  author?: string
}

export type Post = PostMetadata & {
  content: string
}

export function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"))
  } catch (error) {
    console.error("Error reading post directory:", error)
    return []
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.md$/, "")
    const fullPath = path.join(postsDirectory, `${realSlug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Format the date
    let formattedDate = ""
    if (data.date) {
      const date = new Date(data.date)
      formattedDate = format(date, "MMMM d, yyyy")
    }

    return {
      slug: realSlug,
      title: data.title || "Untitled Post",
      date: data.date || new Date().toISOString(),
      formattedDate,
      excerpt: data.excerpt || "",
      coverImage: data.coverImage || "",
      author: data.author || "",
      content,
    }
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    return null
  }
}

export function getAllPosts(): PostMetadata[] {
  try {
    const slugs = getPostSlugs()
    const posts = slugs
      .map((slug) => getPostBySlug(slug))
      .filter((post): post is Post => post !== null)
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))

    return posts.map(({ slug, title, date, formattedDate, excerpt, coverImage, author }) => ({
      slug,
      title,
      date,
      formattedDate,
      excerpt,
      coverImage,
      author,
    }))
  } catch (error) {
    console.error("Error getting all posts:", error)
    return []
  }
}

export async function markdownToHtml(markdown: string) {
  try {
    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(markdown)

    return result.toString()
  } catch (error) {
    console.error("Error converting markdown to HTML:", error)
    return ""
  }
}
