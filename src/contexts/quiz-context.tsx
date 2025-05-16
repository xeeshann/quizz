import { createContext, useState, useContext, ReactNode } from "react";

// Types
export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: number;
  timeLimit: string;
  played: number;
  rating: number;
  featured: boolean;
  image: string;
  fullQuestions?: Question[];
}

export interface UserScore {
  quizId: number;
  score: number;
  completedAt: Date;
  timeSpent: number; // in seconds
  correctAnswers: number;
  totalQuestions: number;
}

interface UserState {
  username: string | null;
  completedQuizzes: UserScore[];
  totalScore: number;
  rank: number | null;
}

interface QuizContextType {
  quizzes: Quiz[];
  featuredQuizzes: Quiz[];
  popularQuizzes: Quiz[];
  user: UserState;
  loadQuizById: (id: number) => Quiz | null;
  saveQuizResult: (quizId: number, score: number, timeSpent: number, correctAnswers: number, totalQuestions: number) => void;
  loginUser: (username: string) => void;
  logoutUser: () => void;
}

// Sample questions data
const questionsData: Record<number, Question[]> = {
  1: [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correctAnswer: 1
    },
    {
      id: 2,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2
    },
    {
      id: 3,
      question: "What is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 2
    },
    {
      id: 4,
      question: "What year did World War II end?",
      options: ["1943", "1944", "1945", "1946"],
      correctAnswer: 2
    },
    {
      id: 5,
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correctAnswer: 1
    }
  ],
  2: [
    {
      id: 1,
      question: "What is the chemical symbol for gold?",
      options: ["Gd", "Go", "Au", "Ag"],
      correctAnswer: 2
    },
    {
      id: 2,
      question: "Which planet has the most moons?",
      options: ["Jupiter", "Saturn", "Uranus", "Neptune"],
      correctAnswer: 1
    },
    {
      id: 3,
      question: "What is the smallest unit of life?",
      options: ["Atom", "Cell", "Molecule", "Organelle"],
      correctAnswer: 1
    },
    {
      id: 4,
      question: "What is the speed of light in a vacuum?",
      options: ["300,000 km/s", "150,000 km/s", "200,000 km/s", "250,000 km/s"],
      correctAnswer: 0
    },
    {
      id: 5,
      question: "What is the hardest natural substance on Earth?",
      options: ["Diamond", "Titanium", "Platinum", "Quartz"],
      correctAnswer: 0
    }
  ]
};

// Sample data
const quizData: Quiz[] = [
  {
    id: 1,
    title: "General Knowledge Challenge",
    description: "Test your general knowledge with this fun quiz covering various topics.",
    category: "General Knowledge",
    difficulty: "Medium",
    questions: 15,
    timeLimit: "10 min",
    played: 1203,
    rating: 4.5,
    featured: true,
    image: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?q=80&w=300&auto=format&fit=crop",
    fullQuestions: questionsData[1]
  },
  {
    id: 2,
    title: "Science Trivia",
    description: "Explore the world of science with questions on physics, chemistry, and biology.",
    category: "Science",
    difficulty: "Hard",
    questions: 20,
    timeLimit: "15 min",
    played: 845,
    rating: 4.2,
    featured: true,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=300&auto=format&fit=crop",
    fullQuestions: questionsData[2]
  },
  {
    id: 3,
    title: "World History Masters",
    description: "Journey through time with this challenging history quiz.",
    category: "History",
    difficulty: "Hard",
    questions: 25,
    timeLimit: "20 min",
    played: 632,
    rating: 4.8,
    featured: false,
    image: "https://images.unsplash.com/photo-1461360370896-8a6be460a229?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 4,
    title: "Geography Explorer",
    description: "Test your knowledge of countries, capitals, and landmarks.",
    category: "Geography",
    difficulty: "Medium",
    questions: 15,
    timeLimit: "12 min",
    played: 912,
    rating: 4.3,
    featured: false,
    image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 5,
    title: "Pop Culture Quiz",
    description: "Stay updated with the latest trends in movies, music, and celebrities.",
    category: "Entertainment",
    difficulty: "Easy",
    questions: 10,
    timeLimit: "8 min",
    played: 1567,
    rating: 4.1,
    featured: true,
    image: "https://images.unsplash.com/photo-1603739903239-8b6e64c3b185?q=80&w=300&auto=format&fit=crop"
  },
  {
    id: 6,
    title: "Sports Champions",
    description: "For sports enthusiasts! Test your knowledge about various sports and athletes.",
    category: "Sports",
    difficulty: "Medium",
    questions: 15,
    timeLimit: "10 min",
    played: 789,
    rating: 4.4,
    featured: false,
    image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=300&auto=format&fit=crop"
  }
];

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component
export function QuizProvider({ children }: { children: ReactNode }) {
  // State
  const [quizzes] = useState<Quiz[]>(quizData);
  const [user, setUser] = useState<UserState>({
    username: null,
    completedQuizzes: [],
    totalScore: 0,
    rank: null,
  });

  // Get featured quizzes
  const featuredQuizzes = quizzes.filter(quiz => quiz.featured);

  // Get popular quizzes (based on 'played' count)
  const popularQuizzes = [...quizzes].sort((a, b) => b.played - a.played).slice(0, 4);

  // Load a quiz by ID
  const loadQuizById = (id: number) => {
    return quizzes.find(quiz => quiz.id === id) || null;
  };

  // Save quiz result
  const saveQuizResult = (quizId: number, score: number, timeSpent: number, correctAnswers: number, totalQuestions: number) => {
    if (!user.username) return;

    // Add to completed quizzes
    const newCompletedQuizzes = [
      ...user.completedQuizzes,
      {
        quizId,
        score,
        completedAt: new Date(),
        timeSpent,
        correctAnswers,
        totalQuestions
      },
    ];

    // Calculate new total score
    const newTotalScore = newCompletedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);

    setUser({
      ...user,
      completedQuizzes: newCompletedQuizzes,
      totalScore: newTotalScore,
    });
  };

  // Login user
  const loginUser = (username: string) => {
    setUser({
      ...user,
      username,
    });
  };

  // Logout user
  const logoutUser = () => {
    setUser({
      username: null,
      completedQuizzes: [],
      totalScore: 0,
      rank: null,
    });
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        featuredQuizzes,
        popularQuizzes,
        user,
        loadQuizById,
        saveQuizResult,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

// Custom hook for using the quiz context
export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
}
