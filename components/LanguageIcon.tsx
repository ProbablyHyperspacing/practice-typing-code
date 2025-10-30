import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiReact,
  SiRust,
  SiC,
  SiCplusplus,
  SiSolidity,
  SiMysql,
  SiGnubash,
  SiOpenjdk
} from 'react-icons/si';
import { TbRegex, TbFileCode, TbCode } from 'react-icons/tb';
import { IconType } from 'react-icons';

const languageIcons: Record<string, IconType> = {
  javascript: SiJavascript,
  typescript: SiTypescript,
  python: SiPython,
  react: SiReact,
  rust: SiRust,
  c: SiC,
  'c++': SiCplusplus,
  java: SiOpenjdk,
  solidity: SiSolidity,
  sql: SiMysql,
  bash: SiGnubash,
  ada: TbCode,
  regex: TbRegex,
  pseudocode: TbFileCode,
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
