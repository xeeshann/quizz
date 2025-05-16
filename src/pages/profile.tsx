import { useState } from "react";
import { Card, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Link } from "@heroui/link";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { useQuiz } from "@/contexts/quiz-context";
import QuizCard from "@/components/quiz-card";

export default function ProfilePage() {
  const { user, quizzes, loginUser, logoutUser } = useQuiz();
  const [activeTab, setActiveTab] = useState("overview");
  
  // These would normally come from user data
  const userStats = {
    name: user.username || "Guest User",
    username: user.username || "guest",
    email: "user@example.com",
    joined: "May 10, 2025",
    quizzesCompleted: user.completedQuizzes.length,
    averageScore: user.completedQuizzes.length > 0 
      ? Math.round(user.completedQuizzes.reduce((sum, q) => sum + q.score, 0) / user.completedQuizzes.length) 
      : 0,
    level: "Novice",
    levelProgress: 35,
    badges: ["Quick Learner", "Quiz Enthusiast"],
    achievements: [
      { name: "First Quiz", description: "Complete your first quiz", completed: true },
      { name: "Perfect Score", description: "Score 100% on any quiz", completed: false },
      { name: "Quiz Master", description: "Complete 10 quizzes", completed: false },
    ]
  };
  
  // Mock recommended quizzes (based on user interests)
  const recommendedQuizzes = quizzes.slice(0, 3);
  
  // Mock quiz history
  const quizHistory = [
    {
      id: 1,
      title: "General Knowledge",
      date: "May 15, 2025",
      score: 85,
      timeSpent: "8:24"
    },
    {
      id: 2,
      title: "Science Trivia",
      date: "May 14, 2025",
      score: 70,
      timeSpent: "12:10"
    },
    {
      id: 3,
      title: "World History",
      date: "May 12, 2025",
      score: 92,
      timeSpent: "15:30"
    }
  ];
  
  // For demonstration purposes
  const handleLogin = () => {
    loginUser("DemoUser");
  };
  
  const handleLogout = () => {
    logoutUser();
  };
  
  return (
    <DefaultLayout>
      <section className="py-8 md:py-10">
        <div className="max-w-xl">
          <h1 className={title({ size: "lg" })}>My Profile</h1>
        </div>
      </section>
      
      {user.username ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - User Info */}
          <div className="w-full lg:w-1/3">
            <Card className="sticky top-24">
              <CardHeader className="pb-0 pt-6 px-6 flex-col items-start">
                <div className="flex flex-col items-center w-full">
                  <Avatar
                    src="https://i.pravatar.cc/150?img=3"
                    className="w-20 h-20 text-large mb-4"
                    showFallback
                    name={userStats.name}
                  />
                  <h2 className="text-xl font-bold">{userStats.name}</h2>
                  <p className="text-default-500">@{userStats.username}</p>
                  
                  <div className="flex gap-2 mt-4 mb-6 justify-center w-full">
                    <Button 
                      color="primary" 
                      variant="flat" 
                      radius="full" 
                      size="sm"
                      className="min-w-0"
                    >
                      Edit Profile
                    </Button>
                    <Button 
                      color="danger" 
                      variant="flat" 
                      radius="full" 
                      size="sm"
                      className="min-w-0"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </div>
                </div>
                
                <Divider className="my-4" />
                
                <div className="w-full space-y-4">
                  <div>
                    <p className="text-default-500 text-sm mb-1">Level</p>
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-semibold">{userStats.level}</p>
                      <p className="text-sm text-default-500">{userStats.levelProgress}%</p>
                    </div>
                    <Progress value={userStats.levelProgress} color="primary" className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-default-50 p-3 rounded-lg">
                      <p className="text-default-500 text-xs">Quizzes Completed</p>
                      <p className="text-lg font-bold">{userStats.quizzesCompleted}</p>
                    </div>
                    <div className="bg-default-50 p-3 rounded-lg">
                      <p className="text-default-500 text-xs">Average Score</p>
                      <p className="text-lg font-bold">{userStats.averageScore}%</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-default-500 text-sm mb-2">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      {userStats.badges.map((badge, index) => (
                        <Chip 
                          key={index} 
                          color={index % 2 === 0 ? "primary" : "success"} 
                          variant="flat"
                          size="sm"
                        >
                          {badge}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-default-500 text-sm mb-2">Member Since</p>
                    <p>{userStats.joined}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            <Tabs 
              aria-label="Profile tabs" 
              selectedKey={activeTab}
              onSelectionChange={setActiveTab as any}
              color="primary"
              variant="underlined"
              classNames={{
                tabList: "gap-6"
              }}
            >
              <Tab key="overview" title="Overview">
                <div className="space-y-8">
                  {/* Achievements */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Achievements</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {userStats.achievements.map((achievement, index) => (
                        <div 
                          key={index} 
                          className={`border rounded-lg p-4 ${achievement.completed ? 'bg-success-50 border-success-200' : 'bg-default-50 border-default-200'}`}
                        >
                          <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center">
                            {achievement.completed ? (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-success">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-default-300">
                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <h3 className="font-semibold mb-1">{achievement.name}</h3>
                          <p className="text-sm text-default-600">{achievement.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Activity */}
                  <div>
                    <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="p-4 border border-default-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary">
                              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold">Completed Quiz</p>
                            <p className="text-sm text-default-500">2 hours ago</p>
                          </div>
                        </div>
                        <p className="text-default-600">You completed the "General Knowledge" quiz with a score of 85%.</p>
                      </div>
                      <div className="p-4 border border-default-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-success-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-success">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-semibold">Badge Earned</p>
                            <p className="text-sm text-default-500">1 day ago</p>
                          </div>
                        </div>
                        <p className="text-default-600">You earned the "Quiz Enthusiast" badge.</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Recommended Quizzes */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">Recommended For You</h2>
                      <Button 
                        as={Link}
                        href="/quizzes"
                        color="primary" 
                        variant="flat" 
                        size="sm"
                      >
                        See All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {recommendedQuizzes.map((quiz) => (
                        <QuizCard 
                          key={quiz.id}
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
                          compact
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Tab>
              
              <Tab key="history" title="Quiz History">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold">Your Quiz History</h2>
                  
                  <Table 
                    aria-label="Quiz History"
                    className="border border-default-200 rounded-lg overflow-hidden"
                  >
                    <TableHeader>
                      <TableColumn>QUIZ NAME</TableColumn>
                      <TableColumn>DATE TAKEN</TableColumn>
                      <TableColumn>SCORE</TableColumn>
                      <TableColumn>TIME SPENT</TableColumn>
                      <TableColumn>ACTIONS</TableColumn>
                    </TableHeader>
                    <TableBody>
                      {quizHistory.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell>
                            <div className="font-medium">{quiz.title}</div>
                          </TableCell>
                          <TableCell>{quiz.date}</TableCell>
                          <TableCell>
                            <Chip 
                              color={quiz.score >= 80 ? "success" : quiz.score >= 60 ? "warning" : "danger"} 
                              variant="flat"
                            >
                              {quiz.score}%
                            </Chip>
                          </TableCell>
                          <TableCell>{quiz.timeSpent}</TableCell>
                          <TableCell>
                            <Button 
                              as={Link}
                              href={`/quiz/${quiz.id}`}
                              size="sm" 
                              color="primary" 
                              variant="flat"
                            >
                              Retry Quiz
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {quizHistory.length === 0 && (
                    <div className="text-center p-12 border border-dashed rounded-lg">
                      <p className="text-default-500 mb-4">You haven't taken any quizzes yet.</p>
                      <Button 
                        as={Link}
                        href="/quizzes"
                        color="primary"
                      >
                        Browse Quizzes
                      </Button>
                    </div>
                  )}
                </div>
              </Tab>
              
              <Tab key="settings" title="Settings">
                <div className="space-y-8">
                  <h2 className="text-xl font-bold">Account Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                          label="Full Name" 
                          defaultValue={userStats.name}
                          variant="bordered"
                        />
                        <Input 
                          label="Username" 
                          defaultValue={userStats.username}
                          variant="bordered"
                        />
                        <Input 
                          label="Email" 
                          defaultValue={userStats.email}
                          type="email"
                          variant="bordered"
                        />
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-default-500">Receive email updates about quiz results</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-default-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-default-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Dark Mode</p>
                            <p className="text-sm text-default-500">Toggle between light and dark mode</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="w-11 h-6 bg-default-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-default-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Security</h3>
                      <Button color="primary" variant="flat">Change Password</Button>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 text-danger">Danger Zone</h3>
                      <Button color="danger" variant="flat">Delete Account</Button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button color="primary">Save Changes</Button>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      ) : (
        // User not logged in
        <section className="py-16 flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Login to Access Your Profile</h2>
            <p className="text-default-600 mb-8">
              Sign in to track your quiz progress, view your achievements, and join the leaderboard.
            </p>
            
            <div className="space-y-4">
              <Button 
                color="primary" 
                size="lg" 
                className="w-full"
                onClick={handleLogin}
              >
                Login as Demo User
              </Button>
              <p className="text-sm text-default-500">
                Don't have an account? <Link href="#" className="text-primary">Create one now</Link>
              </p>
            </div>
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
