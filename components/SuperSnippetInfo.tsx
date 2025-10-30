'use client';

interface SuperSnippetInfoProps {
  story: string;
  description: string;
  impact: string;
}

export default function SuperSnippetInfo({ story, description, impact }: SuperSnippetInfoProps) {
  return (
    <div className="fixed left-32 top-20 mt-20 w-64 space-y-6 pointer-events-none" style={{ paddingTop: '1.375rem' }}>
      {/* Story */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary/50 dark:text-text-secondary/50">
          Story
        </h3>
        <p className="text-sm font-medium text-accent-light-primary dark:text-accent-primary">
          {story}
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary/50 dark:text-text-secondary/50">
          Description
        </h3>
        <p className="text-sm text-text-light-primary/80 dark:text-text-primary/80 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Impact */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary/50 dark:text-text-secondary/50">
          Impact
        </h3>
        <p className="text-sm font-medium text-incorrect-light dark:text-incorrect">
          {impact}
        </p>
      </div>
    </div>
  );
}
