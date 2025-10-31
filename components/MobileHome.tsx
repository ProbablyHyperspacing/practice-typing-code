'use client';

import Image from 'next/image';

export default function MobileHome() {
  return (
    <div className="min-h-screen bg-bg-light-primary dark:bg-bg-primary flex items-start justify-center p-8 pt-16 overflow-auto">
      <div className="max-w-2xl text-center">
        <div className="mb-16">
          <h2 className="text-2xl font-display font-black tracking-tight">
            <span className="text-gradient">Code Typing Practice</span>
          </h2>
        </div>
        <p className="prose prose-lg dark:prose-invert text-accent-light-primary dark:text-accent-primary mb-2">
          Why are you trying to learn to code on a phone...?
        </p>
        <p className="prose dark:prose-invert text-text-light-secondary dark:text-text-secondary opacity-60 mb-8">
          Oh, maybe you just wanted to see what it looked like. Here you go:
        </p>
        <div className="w-full mx-auto">
          <Image
            src="/desktop-screenshot.png"
            alt="Code Typing Practice Desktop Screenshot"
            width={1920}
            height={1080}
            className="w-full h-auto object-contain"
            style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))' }}
            priority
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
