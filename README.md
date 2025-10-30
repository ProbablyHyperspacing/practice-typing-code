# Practice Typing Code

A minimalist, beautiful typing practice application specifically designed for developers to improve their coding speed and accuracy. Inspired by the clean aesthetics of MonkeyType and NuPhy.

## Features

- **Multiple Programming Languages**: Practice with JavaScript, TypeScript, Python, React, and Rust code snippets
- **Real-time Statistics**: Track WPM, accuracy, and time as you type
- **Clean, Minimalist Design**: Inspired by MonkeyType and NuPhy's aesthetic
- **Difficulty Levels**: Easy, medium, and hard code snippets for progressive learning
- **Keyboard Shortcuts**:
  - `Esc` - Reset current session
  - `Shift + Enter` - Get a new snippet
- **Responsive Results**: Beautiful modal showing detailed performance metrics
- **Smooth Animations**: Powered by Framer Motion for delightful interactions

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Font**: JetBrains Mono for code, Inter for UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/practice-typing-code.git
cd practice-typing-code
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
practice-typing-code/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page component
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── TypingArea.tsx   # Main typing interface
│   ├── StatsDisplay.tsx # Statistics display
│   ├── LanguageSelector.tsx
│   └── ResultsModal.tsx
├── hooks/               # Custom React hooks
│   └── useTyping.ts     # Typing logic hook
├── data/                # Static data
│   └── codeSnippets.json
├── types/               # TypeScript types
├── utils/               # Utility functions
└── public/              # Static assets
```

## Adding New Code Snippets

To add new code snippets, edit the `data/codeSnippets.json` file:

```json
{
  "languages": {
    "javascript": {
      "snippets": [
        {
          "id": "unique-id",
          "difficulty": "easy|medium|hard",
          "code": "// Your code snippet here"
        }
      ]
    }
  }
}
```

## Design Philosophy

Practice Typing Code follows a minimalist design philosophy inspired by:

- **MonkeyType**: Clean typing interface with real-time feedback
- **NuPhy**: Minimalist aesthetics with carefully chosen accent colors

The dark theme with amber accents creates a focused, distraction-free environment perfect for practice sessions.

## Performance Tips

- Practice regularly to improve muscle memory
- Focus on accuracy first, speed will follow
- Use the difficulty levels to progressively challenge yourself
- Pay attention to common patterns in each language

## Future Enhancements

- [ ] User accounts and progress tracking
- [ ] Leaderboards
- [ ] Custom code snippet uploads
- [ ] More programming languages
- [ ] Theme customization
- [ ] Detailed analytics and progress charts
- [ ] Multiplayer racing mode

## License

MIT

## Acknowledgments

- Inspired by [MonkeyType](https://monkeytype.com/)
- Design aesthetics influenced by [NuPhy](https://nuphy.com/)
- Built with love for the developer community