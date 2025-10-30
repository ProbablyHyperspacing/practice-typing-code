'use client';

interface NormalSnippetInfoProps {
  name: string;
  description: string;
  situation: string;
}

export default function NormalSnippetInfo({ name, description, situation }: NormalSnippetInfoProps) {
  return (
    <div className="fixed left-32 top-20 mt-20 w-64 space-y-6 pointer-events-none" style={{ paddingTop: '1.375rem' }}>
      {/* Name */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary/50 dark:text-text-secondary/50">
          Name
        </h3>
        <p className="text-sm font-medium text-accent-light-primary dark:text-accent-primary">
          {name}
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

      {/* Situation */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary/50 dark:text-text-secondary/50">
          Situation
        </h3>
        <p className="text-sm font-medium text-incorrect-light dark:text-incorrect">
          {situation}
        </p>
      </div>
    </div>
  );
}
