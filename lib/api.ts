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

function getAllFiles(dir: string, fileList: string[] = []): string[] {
  try {
    const files = fs.readdirSync(dir)
    files.forEach(file => {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList)
      } else if (file.endsWith('.md')) {
        // Create a path relative to the blog directory
        const relativePath = path.relative(postsDirectory, filePath)
        fileList.push(relativePath)
      }
    })
    return fileList
  } catch (error) {
    console.error("Error reading directory:", error)
    return fileList
  }
}

export function getPostSlugs() {
  try {
    // Get direct .md files in the blog directory
    const directFiles = fs.readdirSync(postsDirectory)
      .filter((file) => file.endsWith(".md"))
    
    // Get all files in subdirectories
    const allFiles = getAllFiles(postsDirectory)
    
    // Remove any duplicates and return
    return [...new Set([...directFiles, ...allFiles])]
  } catch (error) {
    console.error("Error reading post directory:", error)
    return []
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.md$/, "")
    
    // First, try to find the file at the root level
    let fullPath = path.join(postsDirectory, `${realSlug}.md`)
    
    // If file doesn't exist at root level, try to find it in subdirectories
    if (!fs.existsSync(fullPath)) {
      // Check if the slug might be a directory with an index.md file
      const indexPath = path.join(postsDirectory, realSlug, 'index.md')
      if (fs.existsSync(indexPath)) {
        fullPath = indexPath
      } else {
        // Try to find the file by matching the slug to the relative path
        const allFiles = getAllFiles(postsDirectory)
        const matchingFile = allFiles.find(file => {
          // Convert file path to slug (remove extension, replace slashes)
          const fileSlug = file.replace(/\.md$/, "").replace(/\\/g, "/")
          return fileSlug === realSlug || path.basename(fileSlug) === realSlug
        })
        
        if (matchingFile) {
          fullPath = path.join(postsDirectory, matchingFile)
        } else {
          return null
        }
      }
    }

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

    // For index.md files in a directory, use the directory name as the slug
    let postSlug = realSlug
    if (path.basename(fullPath) === 'index.md') {
      postSlug = path.basename(path.dirname(fullPath))
    }

    return {
      slug: postSlug,
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
