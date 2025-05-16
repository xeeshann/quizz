import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Pagination } from "@heroui/pagination";
import { Select, SelectItem } from "@heroui/select";
import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import QuizCard from "@/components/quiz-card";
import { useQuiz } from "@/contexts/quiz-context";
import LoadingSpinner from "@/components/loading-spinner";

export default function QuizzesPage() {
  const { quizzes } = useQuiz();
  const [selectedTab, setSelectedTab] = useState("all");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort quizzes
  const filteredQuizzes = quizzes
    // Filter by tab
    .filter(quiz => {
      if (selectedTab === "all") return true;
      if (selectedTab === "featured") return quiz.featured;
      return quiz.category.toLowerCase() === selectedTab;
    })
    // Filter by difficulty
    .filter(quiz => {
      if (difficulty === "all") return true;
      return quiz.difficulty.toLowerCase() === difficulty.toLowerCase();
    })
    // Filter by search query
    .filter(quiz => {
      if (!searchQuery) return true;
      return quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.category.toLowerCase().includes(searchQuery.toLowerCase());
    })
    // Sort
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.played - a.played;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          // For demo, we'll use ID as a proxy for "newest"
          return b.id - a.id;
        default:
          return 0;
      }
    });

  // Pagination
  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <DefaultLayout>
        <LoadingSpinner message="Loading quizzes..." />
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      {/* Header */}
      <section className="py-8 md:py-10">
        <div className="max-w-xl">
          <h1 className={title({ size: "lg" })}>Available Quizzes</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Explore our collection of quizzes and challenge yourself across various topics.
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
          <div className="w-full md:w-1/3">
            <Input
              label="Search Quizzes"
              placeholder="Type to search..."
              size="lg"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-default-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Select 
              label="Difficulty"
              className="w-full md:w-40"
              size="sm"
              selectedKeys={[difficulty]}
              onChange={(e) => {
                setDifficulty(e.target.value);
                setPage(1); // Reset to first page on filter change
              }}
            >
              <SelectItem key="all">All Levels</SelectItem>
              <SelectItem key="easy">Easy</SelectItem>
              <SelectItem key="medium">Medium</SelectItem>
              <SelectItem key="hard">Hard</SelectItem>
            </Select>
            
            <Select 
              label="Sort By"
              className="w-full md:w-40"
              size="sm"
              selectedKeys={[sortBy]}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
            >
              <SelectItem key="popular">Most Popular</SelectItem>
              <SelectItem key="newest">Newest</SelectItem>
              <SelectItem key="rating">Highest Rated</SelectItem>
            </Select>
          </div>
        </div>
      </section>
      
      {/* Quiz Categories Tabs */}
      <section className="mb-8">
        <Tabs 
          aria-label="Quiz Categories" 
          selectedKey={selectedTab}
          onSelectionChange={setSelectedTab as any}
          variant="underlined"
          color="primary"
          size="lg"
          className="w-full"
        >
          <Tab key="all" title="All Quizzes" />
          <Tab key="featured" title="Featured" />
          <Tab key="general knowledge" title="General Knowledge" />
          <Tab key="science" title="Science" />
          <Tab key="history" title="History" />
          <Tab key="geography" title="Geography" />
          <Tab key="entertainment" title="Entertainment" />
          <Tab key="sports" title="Sports" />
        </Tabs>
      </section>

      {/* Quiz Grid */}
      <section className="mb-12">
        {paginatedQuizzes.length > 0 ? (          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {paginatedQuizzes.map((quiz) => (
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
        ) : (
          <div className="py-16 text-center">
            <div className="mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-default-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">No quizzes found</h3>
            <p className="text-default-600 mb-6 max-w-md mx-auto">
              We couldn't find any quizzes matching your current filters. Try adjusting your search criteria.
            </p>
            <Button
              color="primary"
              variant="flat"
              onClick={() => {
                setSearchQuery("");
                setDifficulty("all");
                setSelectedTab("all");
                setSortBy("popular");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* Pagination */}
      {paginatedQuizzes.length > 0 && (
        <section className="flex justify-center mb-12">
          <Pagination 
            total={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary"
            showControls
          />
        </section>
      )}

      {/* Call to Action */}
      <section className="py-8 px-4 mb-8">
        <div className="max-w-4xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm border border-default-200">
          <h2 className={title({ size: "sm" })}>Can't find what you're looking for?</h2>
          <p className="text-default-600 mt-4 mb-8 max-w-lg mx-auto">
            We're constantly adding new quizzes to our collection. If you have a suggestion or would like to contribute, let us know!
          </p>
          <Button
            color="primary"
            size="lg"
            radius="full"
            variant="shadow"
            className="font-medium"
            as={Link}
            href="/contact"
          >
            Suggest a Quiz
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}
