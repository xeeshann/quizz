# Hero Quiz App

A modern, interactive quiz application built with React, TypeScript, and the HeroUI component library.

![Hero Quiz App Banner](https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=1000&auto=format&fit=crop)

## Features

### For Users
- **Multiple Quiz Categories**: Explore quizzes across various topics including General Knowledge, Science, History, Geography, Entertainment, and Sports
- **Difficulty Levels**: Test your knowledge with Easy, Medium, and Hard difficulty settings
- **Interactive Quiz Interface**: Enjoy a smooth, intuitive quiz-taking experience with real-time feedback
- **Quiz Review**: Review your answers after completion to learn from mistakes
- **Score Tracking**: Keep track of your performance with detailed statistics
- **Reattempt Functionality**: Easily retry quizzes to improve your scores
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices

## Technologies Used

- [Vite](https://vitejs.dev/guide/) - Fast, modern frontend build tool
- [React](https://reactjs.org/) - UI library for building user interfaces
- [HeroUI](https://heroui.com) - Modern component library for React
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Tailwind Variants](https://tailwind-variants.org) - Type-safe variants for Tailwind
- [TypeScript](https://www.typescriptlang.org) - Typed JavaScript for better developer experience
- [React Router](https://reactrouter.com/) - Declarative routing for React
- [Framer Motion](https://www.framer.com/motion) - Animation library for React

## Key Features

### Quiz Experience
- **Interactive UI**: Smooth transitions between quiz states
- **Time Tracking**: Keep track of how long you take to complete quizzes
- **Score Calculation**: Immediate feedback on your performance
- **Review Mode**: See which questions you answered correctly and incorrectly
- **Reattempt Option**: Easily retry quizzes to improve your score

### User Interface
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Dark/Light Mode**: Choose your preferred theme
- **Accessibility**: Designed with keyboard navigation and screen readers in mind
- **Animated Transitions**: Smooth animations for a better user experience

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hero-quiz-app.git
cd hero-quiz-app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

## Project Structure

```
quiz-app/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React contexts for state management
│   ├── layouts/          # Page layouts
│   ├── pages/            # Page components
│   └── styles/           # Global styles
```

## Future Enhancements

- User authentication for persistent profiles
- Leaderboards to compare scores with other users
- User-created quizzes
- Social sharing of quiz results
- More categories and question types

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

Licensed under the [MIT license](LICENSE).

## Acknowledgements

- HeroUI team for the component library
- All contributors to the project
- Image sources for quiz covers
