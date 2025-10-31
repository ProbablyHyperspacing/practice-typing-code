import { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog - Code Typing Practice | Tips for Faster Coding',
  description: 'Learn how to type code faster with expert tips, mechanical keyboard reviews, and proven techniques for developers.',
  keywords: 'typing speed, coding faster, programming tips, mechanical keyboards, touch typing, developer productivity',
  openGraph: {
    title: 'Blog - Code Typing Practice',
    description: 'Learn how to type code faster with expert tips and techniques',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-bg-light-primary dark:bg-bg-primary">
      {/* Header */}
      <header className="py-8 px-4 border-b border-text-light-secondary dark:border-text-secondary border-opacity-10">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-sm text-accent-light-primary dark:text-accent-primary hover:underline mb-4 inline-block">
            ← Back to Practice
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black text-gradient mb-4">
            Blog
          </h1>
          <p className="text-lg text-text-light-secondary dark:text-text-secondary">
            Tips, guides, and insights to help you type code faster
          </p>
        </div>
      </header>

      {/* Blog Posts Grid */}
      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl p-6 border border-text-light-secondary dark:border-text-secondary border-opacity-10 hover:border-accent-light-primary dark:hover:border-accent-primary transition-colors"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="space-y-3">
                    {/* Date */}
                    <time className="text-sm text-text-light-secondary dark:text-text-secondary opacity-60">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>

                    {/* Title */}
                    <h2 className="text-2xl font-display font-bold text-text-light-primary dark:text-text-primary hover:text-accent-light-primary dark:hover:text-accent-primary transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-text-light-secondary dark:text-text-secondary leading-relaxed">
                      {post.excerpt}
                    </p>

                    {/* Read More */}
                    <div className="pt-2">
                      <span className="text-accent-light-primary dark:text-accent-primary font-medium hover:underline">
                        Read more →
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
