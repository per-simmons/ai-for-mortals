# AI for Mortals Blog

This is the official blog for AI for Mortals, featuring articles, tutorials, and tips about AI in plain English.

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: Markdown files
- **Deployment**: Vercel

## Development

First, clone the repository:

\`\`\`bash
git clone https://github.com/per-simmons/ai-for-mortals-blog.git
cd ai-for-mortals-blog
\`\`\`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content Management

### Blog Posts

Blog posts are stored as Markdown files in the `content/blog` directory. Each post should include frontmatter with the following fields:

\`\`\`markdown
---
title: "Your Post Title"
date: "YYYY-MM-DD"
excerpt: "A brief summary of your post"
coverImage: "/images/your-image.jpg" # Optional
author: "Your Name" # Optional
---

Your content here...
\`\`\`

### Images

Images should be stored in the `public/images` directory and referenced in markdown files using paths like:

\`\`\`markdown
![Alt text](/images/your-image.jpg)
\`\`\`

## Deployment

This site is automatically deployed to Vercel when changes are pushed to the main branch.

## License

Copyright © AI for Mortals. All rights reserved.
\`\`\`

Finally, let's create a configuration file for Vercel:
