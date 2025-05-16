import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";

import DefaultLayout from "@/layouts/default";
import LoadingSpinner from "@/components/loading-spinner";
import { useQuiz, Quiz as QuizType } from "@/contexts/quiz-context";

// Quiz states
type QuizStatus = "intro" | "in-progress" | "completed" | "review";

export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadQuizById, saveQuizResult, user } = useQuiz();
  
  // Quiz state
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizStatus, setQuizStatus] = useState<QuizStatus>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
    // Load quiz data
  useEffect(() => {
    if (!id) return;
    
    const timer = setTimeout(() => {
      const quizData = loadQuizById(parseInt(id));
      
      if (quizData) {
        // Convert timeLimit string to seconds
        const timeLimitInSeconds = convertTimeLimitToSeconds(quizData.timeLimit);
        setQuiz(quizData);
        setTimeLeft(timeLimitInSeconds);
      } else {
        // Handle quiz not found case
        console.error(`Quiz with id ${id} not found`);
      }
      
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [id, loadQuizById]);
    // Reattempt quiz - reset all quiz state
  const reattemptQuiz = () => {
    if (!quiz?.fullQuestions) {
      return;
    }
    setShowResultModal(false);
    
    // Short delay to allow modal animation to complete
    setTimeout(() => {
      // Reset all the quiz state
      setCurrentQuestionIndex(0);
      // Reset all the quiz state
      setCurrentQuestionIndex(0);
      setAnswers(new Array(quiz.fullQuestions?.length || 0).fill(-1));
      setSelectedOption(null);
      setTimeLeft(convertTimeLimitToSeconds(quiz.timeLimit));
      setShowTimeWarning(false);
      // Scroll to top of quiz content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };
  
  // Helper function to convert time limit string to seconds
  const convertTimeLimitToSeconds = (timeLimit: string): number => {
    const match = timeLimit.match(/(\d+)\s*min/);
    if (match && match[1]) {
      return parseInt(match[1]) * 60;
    }
    return 600; // Default to 10 minutes
  };  // Finish the quiz
  const finishQuiz = () => {
    if (!quiz?.fullQuestions) return;
    
    // No need to save the current answer since it's already being saved in the handleSelectOption function
    // But we'll check if there are any unanswered questions and count them
    const unanswered = answers.filter(answer => answer === -1).length;
    const answeredCount = quiz.fullQuestions.length - unanswered;
    
    // Calculate score
    let correctCount = 0;
    
    for (let i = 0; i < quiz.fullQuestions.length; i++) {
      if (answers[i] === quiz.fullQuestions[i].correctAnswer) {
        correctCount++;
      }
    }
    
    const calculatedScore = Math.round((correctCount / quiz.fullQuestions.length) * 100);
    const timeLimitInSeconds = convertTimeLimitToSeconds(quiz.timeLimit);
    const calculatedTimeSpent = timeLimitInSeconds - timeLeft;
      setScore(calculatedScore);
    setCorrectAnswers(correctCount);
    setTimeSpent(calculatedTimeSpent);
    setQuizStatus("completed");
    
    // Ensure we're scrolled to top before showing modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setShowResultModal(true);
    }, 300); // Short delay to ensure scroll completes first
    
    // Save result to context if user is logged in
    if (user.username) {
      saveQuizResult(
        quiz.id,
        calculatedScore,
        calculatedTimeSpent,
        correctCount,
        quiz.fullQuestions.length
      );
    }
    
    // Analytics event could be added here
    console.log(`Quiz completed: ${answeredCount}/${quiz.fullQuestions.length} questions answered`);
  };

  // Timer effect for quiz
  useEffect(() => {
    if (quizStatus !== "in-progress" || !quiz) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        
        // Show warning when 20% of time is left
        const warningThreshold = convertTimeLimitToSeconds(quiz.timeLimit) * 0.2;
        if (prev === Math.floor(warningThreshold)) {
          setShowTimeWarning(true);
          // Add vibration if browser supports it
          if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(200);
          }
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [quizStatus, quiz, finishQuiz]);
  
  // Start the quiz
  const startQuiz = () => {
    setQuizStatus("in-progress");
    if (quiz?.fullQuestions) {
      setAnswers(new Array(quiz.fullQuestions.length).fill(-1));
    }
  };
    // Handle answer selection with animation
  const handleSelectOption = (index: number) => {
    if (quizStatus === "review") {
      return; // Don't allow changing answers in review mode
    }
    
    // Add a subtle animation/feedback effect
    const feedbackAnimation = () => {
      // You could add additional animation logic here if needed
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Subtle vibration feedback on mobile
      }
    };
    
    if (selectedOption === index) {
      // Allow deselecting the current option
      setSelectedOption(null);
    } else {
      feedbackAnimation();
      setSelectedOption(index);
      
      // Auto-save the answer to the answers array
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = index;
      setAnswers(newAnswers);
    }
  };
    // Move to next question with smooth transition
  const goToNextQuestion = () => {
    if (quiz?.fullQuestions && currentQuestionIndex < quiz.fullQuestions.length - 1) {
      // The answer is already saved in the handleSelectOption function
      // Just navigate to the next question
      setCurrentQuestionIndex(prev => prev + 1);
      
      // Set the selected option based on whether this question was already answered
      const nextIndex = currentQuestionIndex + 1;
      setSelectedOption(answers[nextIndex] !== -1 ? answers[nextIndex] : null);
    } else {
      finishQuiz();
    }
  };
  
  // Move to previous question with smooth transition
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // The answer is already saved in the handleSelectOption function
      // Just navigate to the previous question
      setCurrentQuestionIndex(prev => prev - 1);
      
      // Set the selected option based on the previous answer
      const prevIndex = currentQuestionIndex - 1;
      setSelectedOption(answers[prevIndex] !== -1 ? answers[prevIndex] : null);
    }
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Review answers
  const reviewAnswers = () => {
    setShowResultModal(false);
    setQuizStatus("review");
  };
  
  // Return to quizzes page
  const returnToQuizzes = () => {
    navigate("/quizzes");
  };  // Render current question
  const renderCurrentQuestion = () => {
    if (!quiz?.fullQuestions) return null;
    
    const currentQuestion = quiz.fullQuestions[currentQuestionIndex];
    
    return (
      <div>
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center text-white font-bold shadow-sm text-sm">
              {currentQuestionIndex + 1}
            </div>
            <div>
              <h2 className="text-md font-semibold text-default-600">
                Question {currentQuestionIndex + 1} <span className="text-default-400">of {quiz.fullQuestions.length}</span>
              </h2>
              <div className="flex items-center gap-2 text-xs text-default-500">
                <span className={`px-2 py-0.5 rounded-full ${
                  quiz.difficulty === "Easy" ? "bg-success-100 text-success-600" : 
                  quiz.difficulty === "Medium" ? "bg-warning-100 text-warning-600" : 
                  "bg-danger-100 text-danger-600"
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-3 text-default-900 leading-snug">{currentQuestion.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (              <div
                key={index}
                onClick={() => handleSelectOption(index)}
                className={`p-2 border-2 rounded-xl w-full transition-all duration-200 cursor-pointer 
                  ${
                    quizStatus === "review" 
                      ? index === currentQuestion.correctAnswer 
                        ? 'bg-success-50 border-success hover:bg-success-100' 
                        : index === answers[currentQuestionIndex] 
                          ? 'bg-danger-50 border-danger hover:bg-danger-100'
                          : 'hover:bg-default-100 border-default-200'
                      : selectedOption === index
                        ? 'bg-primary-50 border-primary shadow-sm' 
                        : 'hover:bg-default-100 border-default-200'
                  } 
                  ${
                    selectedOption === index && quizStatus !== "review" 
                      ? 'scale-[1.01] transform' 
                      : ''
                  }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 
                    ${
                      quizStatus === "review" 
                        ? index === currentQuestion.correctAnswer 
                          ? 'bg-success text-white border-success' 
                          : index === answers[currentQuestionIndex] 
                            ? 'bg-danger text-white border-danger'
                            : selectedOption === index
                              ? 'bg-primary-100 border-primary-200'
                              : 'border-default-300 bg-default-100'
                        : selectedOption === index
                          ? 'bg-primary border-primary text-white' 
                          : 'border-default-300 bg-default-100'
                    }`}>
                    {quizStatus === "review" && index === currentQuestion.correctAnswer ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                      </svg>
                    ) : quizStatus === "review" && index === answers[currentQuestionIndex] ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                        <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-xs font-medium">{String.fromCharCode(65 + index)}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs font-medium">{option}</div>
                    
                    {quizStatus === "review" && (
                      <div className="mt-1">
                        {index === currentQuestion.correctAnswer ? (
                          <div className="text-success flex items-center gap-1 font-medium text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Correct answer
                          </div>
                        ) : index === answers[currentQuestionIndex] ? (
                          <div className="text-danger flex items-center gap-1 font-medium text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Your answer (incorrect)
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ml-auto
                    ${
                      quizStatus === "review" 
                        ? index === currentQuestion.correctAnswer 
                          ? 'text-success' 
                          : index === answers[currentQuestionIndex] 
                            ? 'text-danger'
                            : 'text-default-300'
                        : selectedOption === index
                          ? 'text-primary' 
                          : 'text-default-300'
                    }`}>
                    {quizStatus === "review" ? (
                      index === currentQuestion.correctAnswer ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : index === answers[currentQuestionIndex] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    ) : selectedOption === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <DefaultLayout>
        <LoadingSpinner message="Loading quiz..." />
      </DefaultLayout>
    );
  }
  
  if (!quiz || !quiz.fullQuestions) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <h2 className="text-2xl font-bold text-danger">Quiz not found</h2>
          <p className="mt-2 text-default-600">The quiz you're looking for doesn't exist or has been removed.</p>
          <Button 
            color="primary" 
            variant="flat" 
            className="mt-6"
            onClick={returnToQuizzes}
          >
            Return to Quizzes
          </Button>
        </div>
      </DefaultLayout>
    );
  }
  
  return (
    <DefaultLayout>      {/* Quiz Intro */}
      {quizStatus === "intro" && (
        <section className="animate-fadeIn">
          <div 
            className="w-full h-64 md:h-80 bg-cover bg-center rounded-xl mb-8 relative overflow-hidden shadow-lg transform hover:scale-[1.01] transition-transform"
            style={{ backgroundImage: `url(${quiz.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-secondary/70 flex items-center justify-center backdrop-blur-sm">
              <h1 className="text-white text-4xl md:text-5xl font-bold text-center px-4 drop-shadow-md">{quiz.title}</h1>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto bg-default-50/50 rounded-xl p-6 md:p-8 shadow-sm border border-default-200">
            <div className="flex flex-wrap justify-between items-center mb-8">
              <Chip color="primary" variant="flat" className="text-sm mb-4 sm:mb-0">{quiz.category}</Chip>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 p-2 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-default-700 font-medium">{quiz.timeLimit}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                  <span className="text-default-700 font-medium">{quiz.fullQuestions.length} Questions</span>
                </div>
                <Chip 
                  color={quiz.difficulty === "Easy" ? "success" : quiz.difficulty === "Medium" ? "warning" : "danger"}
                  className="font-medium shadow-sm"
                >
                  {quiz.difficulty}
                </Chip>
              </div>
            </div>
              <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                About This Quiz
              </h2>
              <div className="p-5 rounded-lg border border-default-200 shadow-sm">
                <p className="text-default-700 leading-relaxed">{quiz.description}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl border border-default-200 mb-8 shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                Quiz Rules
              </h2>
              <ul className="space-y-3 text-default-700">
                <li className="flex items-start gap-2 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You have <strong>{quiz.timeLimit}</strong> to complete all <strong>{quiz.fullQuestions.length}</strong> questions.</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Each question has only one correct answer.</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You can navigate between questions using the previous and next buttons or the question navigator.</span>
                </li>
                <li className="flex items-start gap-2 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Your score will be calculated based on the number of correct answers.</span>
                </li>
                <li className="flex items-start gap-2 bg-warning-50 p-3 rounded-lg border border-warning-200">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-warning shrink-0 mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  <span>If you don't finish within the time limit, your current answers will be submitted automatically.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex justify-center mb-10">
              <Button 
                size="lg" 
                color="primary" 
                className="px-12 py-7 font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1" 
                startContent={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                  </svg>
                }
                onClick={startQuiz}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </section>
      )}      {/* Quiz In Progress */}
      {(quizStatus === "in-progress" || quizStatus === "review") && (
        <section className="mx-auto animate-fadeIn flex flex-col pb-2 px-2 max-w-5xl">
          {/* Timer and Progress Bar */}
          {quizStatus === "in-progress" && (
            <div className="z-10 pt-1 sticky top-0">
              <div className="backdrop-blur-md bg-white/90 dark:bg-default-50/90 border border-default-200 p-1.5 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`p-0.5 rounded-lg ${showTimeWarning ? 'bg-danger-100 animate-pulse' : 'bg-primary-100'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                        className={`w-3.5 h-3.5 ${showTimeWarning ? 'text-danger' : 'text-primary'}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span className={`font-mono font-semibold text-sm ${showTimeWarning ? 'text-danger animate-pulse' : 'text-default-700'}`}>
                        {formatTime(timeLeft)}
                      </span>
                      <div className="text-[10px] text-default-500">Time Remaining</div>
                    </div>
                    {showTimeWarning && (
                      <Chip color="danger" variant="flat" size="sm" className="animate-pulse ml-1 text-xs h-5 py-0">Time Running Out!</Chip>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-xs font-semibold text-default-700">
                      {Math.round((currentQuestionIndex + 1) / quiz.fullQuestions.length * 100)}% complete
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-default-500">
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-2.5 h-2.5 mr-0.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        {currentQuestionIndex + 1}
                      </span>
                      <span>of</span>
                      <span>{quiz.fullQuestions.length} questions</span>
                    </div>
                  </div>
                </div>
                <Progress 
                  value={(currentQuestionIndex / quiz.fullQuestions.length) * 100} 
                  color={showTimeWarning ? "danger" : "primary"}
                  className="h-1 rounded-lg"
                  showValueLabel={false}
                />
              </div>
            </div>
          )}          {/* Review Mode Header */}
          {quizStatus === "review" && (
            <div className="sticky top-0 z-10">
              <div className="backdrop-blur-md bg-white/90 dark:bg-default-50/90 border border-default-200 p-3 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-default-700">Review Your Answers</h2>
                      <div className="text-xs text-default-500">See what you got right and wrong</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">                    <div className="flex items-center bg-default-100 px-2 py-1 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-default-500 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-medium text-default-700">
                        {correctAnswers} of {quiz.fullQuestions.length} correct
                      </span>
                    </div>
                    
                    <Button
                      color="secondary"
                      size="sm"
                      variant="flat"
                      onClick={reattemptQuiz}
                      startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      }
                      className="text-xs font-medium"
                    >
                      Reattempt
                    </Button>
                    
                    <Chip 
                      color={score >= 80 ? "success" : score >= 50 ? "warning" : "danger"} 
                      variant="flat" 
                      size="sm"
                      className="font-medium"
                    >
                      Score: {score}%
                    </Chip>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center gap-2">
                  <Progress 
                    value={score} 
                    color={score >= 80 ? "success" : score >= 50 ? "warning" : "danger"}
                    className="h-2 rounded-lg flex-1"
                    showValueLabel={false}
                  />
                  <span className="text-xs px-2 py-0.5 rounded bg-default-100 text-default-700 font-medium">
                    {score}%
                  </span>
                </div>
              </div>
            </div>
          )}          {/* Quiz Card */}
          <Card className="flex-1 border border-default-200 shadow-md mt-2 mb-3 overflow-hidden">
            <CardBody className="p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-220px)]">
              {renderCurrentQuestion()}
            </CardBody>
            <CardFooter className="flex justify-between items-center p-3 bg-default-50 border-t border-default-200">
              <Button 
                color="default" 
                variant="flat" 
                onClick={goToPreviousQuestion}
                isDisabled={currentQuestionIndex === 0}
                startContent={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                }
                className="font-medium"
                size="sm"
              >
                Previous
              </Button>
              
              {quizStatus === "in-progress" && (
                currentQuestionIndex === quiz.fullQuestions.length - 1 ? (
                  <Button 
                    color="success" 
                    onClick={finishQuiz}
                    endContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    }
                    className="font-medium shadow-sm"
                    size="sm"
                  >
                    Finish Quiz
                  </Button>
                ) : (
                  <Button 
                    color="primary" 
                    onClick={goToNextQuestion}
                    endContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    }
                    className="font-medium shadow-sm"
                    size="sm"
                  >
                    Next Question
                  </Button>
                )
              )}
                {quizStatus === "review" && (
                currentQuestionIndex === quiz.fullQuestions.length - 1 ? (
                  <div className="flex gap-2">
                    <Button 
                      color="secondary" 
                      onClick={reattemptQuiz}
                      startContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                      }
                      className="font-medium shadow-sm"
                      size="sm"
                    >
                      Reattempt Quiz
                    </Button>
                    <Button 
                      color="primary" 
                      onClick={returnToQuizzes}
                      endContent={
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                      }
                      className="font-medium shadow-sm"
                      size="sm"
                    >
                      Back to Quizzes
                    </Button>
                  </div>
                ) : (
                  <Button 
                    color="primary" 
                    onClick={goToNextQuestion}
                    endContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    }
                    className="font-medium shadow-sm"
                    size="sm"
                  >
                    Next Question
                  </Button>
                )
              )}
            </CardFooter>
          </Card>          {/* Question Navigation */}
          <div className="bg-white dark:bg-default-50 border border-default-200 rounded-xl p-2 shadow-md flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-default-700 text-sm font-semibold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3.003 6.696V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
                Question Navigator
              </h4>
              
              <div className="flex items-center gap-2 text-[10px] text-default-500">
                {quizStatus === "review" ? (
                  <>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-danger"></div>
                      <span>Incorrect</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-default-100 border border-primary"></div>
                      <span>Answered</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
              {quiz.fullQuestions.map((_, index) => (
                <Button
                  key={index}
                  size="sm"
                  className={`min-w-0 h-6 p-0 text-[10px] font-medium transition-all duration-200 ${
                    currentQuestionIndex === index ? 'transform scale-110 shadow-sm z-10' : ''
                  } ${
                    quizStatus === "review" &&
                    quiz.fullQuestions && answers[index] === quiz.fullQuestions[index].correctAnswer 
                      ? "border-success" 
                      : quizStatus === "review" && answers[index] !== -1 
                        ? "border-danger" 
                        : ""
                  }`}
                  color={
                    currentQuestionIndex === index
                      ? "primary"
                      : quizStatus === "review"
                        ? quiz.fullQuestions && answers[index] === quiz.fullQuestions[index].correctAnswer
                          ? "success"
                          : answers[index] !== -1 ? "danger" : "default"
                        : answers[index] !== -1
                          ? "default"
                          : "default"
                  }
                  variant={
                    currentQuestionIndex === index
                      ? "solid"
                      : answers[index] !== -1
                        ? "flat"
                        : "bordered"
                  }
                  onClick={() => {
                    if (selectedOption !== null) {
                      const newAnswers = [...answers];
                      newAnswers[currentQuestionIndex] = selectedOption;
                      setAnswers(newAnswers);
                    }
                    setCurrentQuestionIndex(index);
                    setSelectedOption(answers[index] !== -1 ? answers[index] : null);
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            
            {quizStatus === "in-progress" && (
              <Button 
                color="success" 
                variant="flat" 
                onClick={finishQuiz}                size="sm"
                className="font-medium transition-all mt-1 w-full py-1 text-xs"
                startContent={
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              >
                Submit Quiz ({answers.filter(a => a !== -1).length}/{quiz.fullQuestions.length})
              </Button>
            )}          </div>
        </section>
      )}
        {/* Results Modal */}
      <Modal 
        isOpen={showResultModal} 
        onOpenChange={setShowResultModal} 
        size="3xl"
        scrollBehavior="inside"
        placement="center"
        classNames={{
          backdrop: "bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm",
          base: "mx-auto my-10",
          body: "max-h-[70vh] overflow-auto"
        }}
      >
        <ModalContent className="max-h-[90vh]">
          <ModalHeader className="flex flex-col gap-1 border-b pb-4 sticky top-0 z-10 bg-background">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
              Quiz Results
            </h3>
            <p className="text-default-500">You've completed the "{quiz.title}" quiz!</p>
          </ModalHeader>
          <ModalBody className="p-6 overflow-y-auto">
            <div className="text-center mb-8">
              <div className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-4 relative"
                style={{
                  background: `conic-gradient(${score >= 80 ? '#17c964' : score >= 50 ? '#f5a524' : '#f31260'} ${score}%, #e4e4e7 0%)`,
                }}
              >
                <div className="bg-background w-24 h-24 rounded-full flex items-center justify-center z-10">
                  {score}%
                </div>
                <div className="absolute inset-0 rounded-full animate-pulse opacity-30"
                  style={{
                    background: `conic-gradient(${score >= 80 ? '#17c964' : score >= 50 ? '#f5a524' : '#f31260'} ${score}%, transparent 0%)`,
                  }}
                ></div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 text-default-900">
                {score >= 80 ? '🏆 Excellent!' : score >= 50 ? '👍 Good Job!' : '🎯 Nice Try!'}
              </h3>
              <p className="text-default-700 text-lg">
                You answered <strong className="text-primary">{correctAnswers}</strong> out of <strong>{quiz.fullQuestions.length}</strong> questions correctly.
              </p>
            </div>
              {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 bg-gradient-to-br from-primary-50 to-default-50 rounded-xl border border-default-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-default-700 font-medium">Time Taken</h4>
                </div>
                <p className="text-2xl font-semibold text-default-900">
                  {formatTime(timeSpent)} <span className="text-sm text-default-500">/ {quiz.timeLimit}</span>
                </p>
              </div>
              <div className="p-5 bg-gradient-to-br from-secondary-50 to-default-50 rounded-xl border border-default-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-secondary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  <h4 className="text-default-700 font-medium">Accuracy</h4>
                </div>
                <p className="text-2xl font-semibold text-default-900">
                  {score}% <span className="text-sm text-default-500">({correctAnswers}/{quiz.fullQuestions.length})</span>
                </p>
              </div>
              <div className="p-5 bg-gradient-to-br from-success-50 to-default-50 rounded-xl border border-default-200 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                  </svg>
                  <h4 className="text-default-700 font-medium">Category</h4>
                </div>
                <p className="text-xl font-semibold text-default-900">
                  {quiz.category} <span className="text-sm text-default-500">- {quiz.difficulty}</span>
                </p>
              </div>
            </div>
            
            {/* Performance Assessment */}
            <div className="p-5 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-default-200 mb-6 shadow-md">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                Performance Assessment
              </h4>
              <p className="text-default-700 leading-relaxed">
                {score >= 80 
                  ? "Outstanding! You have an excellent grasp of this subject. Your knowledge is impressive and you've mastered the key concepts. Keep up the great work!"
                  : score >= 50 
                    ? "Good work! You have a solid understanding of this subject, but there's still room for improvement. Review the questions you missed to strengthen your knowledge."
                    : "You've made a good start, but might need to review this subject more thoroughly. Don't worry - with a bit more study, you'll improve your score next time!"
                }
              </p>
            </div>
            
            {!user.username && (
              <div className="p-5 bg-primary/10 rounded-xl border border-primary/30 mb-6 shadow-md">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary mt-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-lg">Sign in to save your progress</h4>
                    <p className="text-default-700 mb-4">
                      Create an account or sign in to save your quiz results, track your progress, compete on the leaderboard, and unlock achievements!
                    </p>
                    <div className="flex gap-3">
                      <Button color="primary" size="md" as="a" href="/login" className="font-medium">
                        Sign In
                      </Button>
                      <Button color="default" variant="bordered" size="md" as="a" href="/register" className="font-medium">
                        Create Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}          </ModalBody>
          <ModalFooter className="border-t pt-4 sticky bottom-0 z-10 bg-background">
            <Button 
              color="default" 
              variant="light" 
              onPress={returnToQuizzes}
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              }
              className="font-medium"
            >
              Return to Quizzes
            </Button>
            <Button 
              color="secondary" 
              onPress={reattemptQuiz}
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              }
              className="font-medium" 
            >
              Reattempt Quiz
            </Button>
            <Button 
              color="primary" 
              onPress={reviewAnswers}
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
                </svg>
              }
              className="font-medium" 
            >
              Review Answers
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}
