import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import QuizzesPage from "@/pages/quizzes";
import QuizDetailPage from "@/pages/quiz-detail";
import LeaderboardPage from "@/pages/leaderboard";
import ProfilePage from "@/pages/profile";
import NotFoundPage from "@/pages/not-found";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<DocsPage />} path="/docs" />
      <Route element={<PricingPage />} path="/pricing" />
      <Route element={<BlogPage />} path="/blog" />
      <Route element={<AboutPage />} path="/about" />
      <Route element={<QuizzesPage />} path="/quizzes" />
      <Route element={<QuizDetailPage />} path="/quiz/:id" />
      <Route element={<LeaderboardPage />} path="/leaderboard" />
      <Route element={<ProfilePage />} path="/profile" />
      <Route element={<NotFoundPage />} path="*" />
    </Routes>
  );
}

export default App;

