import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { button as buttonStyles } from "@heroui/theme";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useQuiz } from "@/contexts/quiz-context";
import QuizCard from "@/components/quiz-card";

export default function IndexPage() {
  const { featuredQuizzes } = useQuiz();

  // Quiz categories
  const categories = [
    { name: "General Knowledge", color: "primary", icon: "🧠" },
    { name: "Science", color: "success", icon: "🔬" },
    { name: "History", color: "warning", icon: "📜" },
    { name: "Geography", color: "danger", icon: "🌎" },
    { name: "Entertainment", color: "secondary", icon: "🎬" },
    { name: "Sports", color: "primary", icon: "⚽" },
  ];

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title({ color: "blue" })}>BrainBurst&nbsp;</span>
          <span className={title()}>Quiz</span>
          <h2 className={subtitle({ class: "mt-4" })}>
            Challenge your knowledge, compete with friends, and have fun with our interactive quizzes!
          </h2>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
              size: "lg",
            })}
            href="/quizzes"
          >
            Start Quiz
          </Link>
          <Link
            className={buttonStyles({ 
              variant: "bordered", 
              radius: "full",
              size: "lg" 
            })}
            href="/leaderboard"
          >
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="py-16 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <h2 className={title({ size: "sm" })}>Featured Quizzes</h2>
            <p className="text-default-600 mt-2">Our most popular and challenging quizzes</p>
          </div>
          <Button
            as={Link}
            href="/quizzes"
            variant="flat"
            color="primary"
            className="mt-5 md:mt-0 font-medium"
            radius="full"
            endContent={<span className="text-lg">→</span>}
          >
            View All Quizzes
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featuredQuizzes.slice(0, 3).map((quiz) => (
            <div key={quiz.id} className="w-full h-full">
              <QuizCard
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                category={quiz.category}
                difficulty={quiz.difficulty}
                questions={quiz.questions}
                timeLimit={quiz.timeLimit}
                played={quiz.played}
                rating={quiz.rating}
                featured={quiz.featured}
                image={quiz.image}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className={title({ size: "sm" })}>Why Choose <span className={title({ color: "blue", size: "sm" })}>BrainBurst</span>?</h2>
          <p className="text-default-600 mt-2 max-w-xl mx-auto">Our platform offers the best quiz experience with unique features</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-b from-white to-default-50 dark:from-default-50 dark:to-default-100/20 backdrop-blur-sm border border-default-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center mb-5 shadow-sm">
              <span className="text-3xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Instant Results</h3>
            <p className="text-default-600">Get immediate feedback on your answers and see your score in real-time as you progress through each quiz.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-gradient-to-b from-white to-default-50 dark:from-default-50 dark:to-default-100/20 backdrop-blur-sm border border-default-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-success/20 flex items-center justify-center mb-5 shadow-sm">
              <span className="text-3xl">🏆</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Compete Globally</h3>
            <p className="text-default-600">Challenge friends and players from around the world on our global leaderboard and climb the ranks.</p>
          </div>
          
          <div className="p-6 rounded-xl bg-gradient-to-b from-white to-default-50 dark:from-default-50 dark:to-default-100/20 backdrop-blur-sm border border-default-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-14 h-14 rounded-full bg-warning/20 flex items-center justify-center mb-5 shadow-sm">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Diverse Topics</h3>
            <p className="text-default-600">Explore quizzes on various subjects from general knowledge to specialized topics that cater to all interests.</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className={title({ size: "sm" })}>Explore Quiz Categories</h2>
          <p className="text-default-600 mt-2 max-w-xl mx-auto">Find the perfect challenge tailored to your interests and expand your knowledge</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={`/quizzes?category=${category.name.toLowerCase()}`} className="group block w-full">
              <Card className="h-full w-full transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-default-200 overflow-hidden bg-gradient-to-b from-white to-default-50 dark:from-default-50 dark:to-default-100/20 flex flex-col justify-between py-3">
                <CardBody className="py-3 flex flex-col justify-center items-center text-center space-y-3">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-${category.color}/20 text-4xl mx-auto shadow-sm`}>
                    {category.icon}
                  </div>
                  <h4 className="text-lg font-semibold line-clamp-1">{category.name}</h4>
                </CardBody>
                <CardFooter className="pt-0 pb-3 justify-center">
                  <Chip 
                    size="sm" 
                    color={category.color as any} 
                    className="px-4 py-1 font-medium transition-transform hover:scale-105"
                    variant="flat"
                  >
                    Explore
                  </Chip>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center p-10 rounded-3xl bg-gradient-to-r from-primary-500/20 via-default-200/20 to-secondary-500/20 backdrop-blur-sm border border-default-200 shadow-xl">
          <h2 className={title({ size: "sm", class: "!leading-tight" })}>Ready to test your knowledge?</h2>
          <p className="text-default-600 mt-6 mb-8 max-w-xl mx-auto text-lg">
            Join thousands of quiz enthusiasts and start challenging yourself today. Create an account to track your progress and compete with others on our global leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              href="/quizzes"
              color="primary"
              size="lg"
              radius="full"
              variant="shadow"
              className="font-medium text-base"
            >
              Start Your First Quiz
            </Button>
            <Button
              as={Link}
              href="/leaderboard"
              color="secondary" 
              size="lg"
              radius="full"
              variant="bordered"
              className="font-medium text-base"
            >
              View Leaderboards
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
