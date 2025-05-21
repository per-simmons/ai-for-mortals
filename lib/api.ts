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
const publicImagesDirectory = path.join(process.cwd(), "public/images")

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

// Helper function to get the slug from a directory or file path
function getSlugFromPath(filePath: string): string {
  // For index.md files in a dated directory, use the directory name (without date prefix)
  if (path.basename(filePath) === 'index.md') {
    const dirName = path.basename(path.dirname(filePath))
    // If directory follows the YYYY-MM-DD-slug format, extract just the slug part
    const match = dirName.match(/^\d{4}-\d{2}-\d{2}-(.+)$/)
    if (match && match[1]) {
      return match[1]
    }
    return dirName
  }
  
  // For regular .md files, use the filename without extension
  return path.basename(filePath, '.md')
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const realSlug = slug.replace(/\.md$/, "")
    
    // First, try to find the file at the root level
    let fullPath = path.join(postsDirectory, `${realSlug}.md`)
    
    // If file doesn't exist at root level, try to find it in subdirectories
    if (!fs.existsSync(fullPath)) {
      // Look for directories with a date prefix and the slug
      const dirs = fs.readdirSync(postsDirectory)
        .filter(dir => fs.statSync(path.join(postsDirectory, dir)).isDirectory())
        .filter(dir => {
          // Match directories with date pattern: YYYY-MM-DD-slug
          const match = dir.match(/^\d{4}-\d{2}-\d{2}-(.+)$/)
          return match && match[1] === realSlug
        })
      
      if (dirs.length > 0) {
        // Use the first matching directory with an index.md file
        const indexPath = path.join(postsDirectory, dirs[0], 'index.md')
        if (fs.existsSync(indexPath)) {
          fullPath = indexPath
        }
      } else {
        // Try to find the file by matching the slug to the relative path
        const allFiles = getAllFiles(postsDirectory)
        const matchingFile = allFiles.find(file => {
          const fileSlug = getSlugFromPath(file)
          return fileSlug === realSlug
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

    // For coverImage, ensure it uses the /images/slug/ format if not already
    let coverImage = data.coverImage || ""
    if (coverImage && !coverImage.startsWith('/images/')) {
      // Extract the slug from the file path or data
      const postSlug = data.slug || getSlugFromPath(fullPath)
      
      // If the coverImage is a relative path, convert it to the public path format
      if (coverImage.startsWith('./') || !coverImage.startsWith('/')) {
        const imageName = path.basename(coverImage)
        coverImage = `/images/${postSlug}/${imageName}`
      }
    }

    return {
      slug: data.slug || getSlugFromPath(fullPath),
      title: data.title || "Untitled Post",
      date: data.date || new Date().toISOString(),
      formattedDate,
      excerpt: data.excerpt || "",
      coverImage,
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
    // Process image paths to ensure they use the public path format
    const processedMarkdown = markdown.replace(
      /!\[(.*?)\]\((\.\/images\/.*?)\)/g, 
      (match, alt, imgPath) => {
        const imgName = path.basename(imgPath)
        // Get the post slug from the current context (would need to be passed in)
        // This is a simplification; you might need a more robust approach
        return `![${alt}](/images/${imgName})`
      }
    )

    const result = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(processedMarkdown)

    return result.toString()
  } catch (error) {
    console.error("Error converting markdown to HTML:", error)
    return ""
  }
}
