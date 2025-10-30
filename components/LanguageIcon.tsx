import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiRust
} from 'react-icons/si';
import { IconType } from 'react-icons';

const languageIcons: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  react: SiReact,
  rust: SiRust,
};

interface LanguageIconProps {
  language: string;
  className?: string;
  size?: number;
}

export default function LanguageIcon({ language, className = '', size }: LanguageIconProps) {
  const Icon = languageIcons[language.toLowerCase()];

  if (!Icon) return null;

  return <Icon className={className} size={size} />;
}

export { languageIcons };
