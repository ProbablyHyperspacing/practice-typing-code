'use client';

interface NormalSnippetInfoProps {
  name: string;
  description: string;
  situation: string;
}

export default function NormalSnippetInfo({ name, description, situation }: NormalSnippetInfoProps) {
  return (
    <div
      className="fixed top-20 mt-20 space-y-4 lg:space-y-6 pointer-events-none transition-all duration-200"
      style={{
        paddingTop: '1.375rem',
        width: 'clamp(10rem, 15vw, 16rem)',
        left: 'calc((max(calc(0.5rem + 11rem), calc(50vw - 488px + 11rem)) - clamp(10rem, 15vw, 16rem)) / 2)'
      }}
    >
      {/* Name */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-secondary opacity-50">
          Name
        </h3>
        <p className="text-sm font-medium text-accent-light-primary dark:text-accent-primary">
          {name}
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-secondary opacity-50">
          Description
        </h3>
        <p className="text-sm text-text-light-primary dark:text-text-primary opacity-80 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Situation */}
      <div className="space-y-2">
        <h3 className="text-xs font-medium uppercase tracking-wider text-text-light-secondary dark:text-text-secondary opacity-50">
          Situation
        </h3>
        <p className="text-sm font-medium text-incorrect-light dark:text-incorrect">
          {situation}
        </p>
      </div>
    </div>
  );
}
