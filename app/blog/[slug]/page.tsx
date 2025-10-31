import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Code Typing Practice`,
    description: post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-light-primary dark:bg-bg-primary">
      {/* Header */}
      <header className="py-8 px-4 border-b border-text-light-secondary dark:border-text-secondary border-opacity-10">
        <div className="max-w-3xl mx-auto">
          <Link href="/blog" className="text-sm text-accent-light-primary dark:text-accent-primary hover:underline mb-4 inline-block">
            ← Back to Blog
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-display font-black text-text-light-primary dark:text-text-primary leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-text-light-secondary dark:text-text-secondary">
              <time>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <span>•</span>
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.readTime} min read</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="py-12 px-4">
        <article className="max-w-3xl mx-auto">
          <div
            className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-accent-light-primary dark:prose-a:text-accent-primary prose-code:text-accent-light-primary dark:prose-code:text-accent-primary prose-pre:bg-bg-light-secondary dark:prose-pre:bg-bg-secondary"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 p-8 bg-bg-light-secondary dark:bg-bg-secondary rounded-2xl border border-accent-light-primary dark:border-accent-primary">
          <h3 className="text-2xl font-display font-bold text-text-light-primary dark:text-text-primary mb-4">
            Ready to improve your typing speed?
          </h3>
          <p className="text-text-light-secondary dark:text-text-secondary mb-6">
            Start practicing with real code snippets from JavaScript, TypeScript, Python, React, and Rust.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-accent-light-primary dark:bg-accent-primary text-bg-light-primary dark:text-bg-primary font-medium rounded-full hover:opacity-90 transition-opacity"
          >
            Start Practicing Now
          </Link>
        </div>
      </main>

      {/* Article Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            author: {
              '@type': 'Person',
              name: post.author,
            },
            publisher: {
              '@type': 'Organization',
              name: 'Code Typing Practice',
              url: 'https://www.codetypingpractice.com',
            },
            datePublished: post.date,
            dateModified: post.date,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://www.codetypingpractice.com/blog/${post.slug}`,
            },
            keywords: post.keywords,
            articleSection: 'Programming',
            about: {
              '@type': 'Thing',
              name: 'Typing Practice for Programmers',
            },
          }),
        }}
      />
    </div>
  );
}
