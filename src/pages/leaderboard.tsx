import { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { Avatar } from "@heroui/avatar";
import { Pagination } from "@heroui/pagination";
import { Chip } from "@heroui/chip";
import { Tabs, Tab } from "@heroui/tabs";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function LeaderboardPage() {
  const [selectedTab, setSelectedTab] = useState("overall");
  const [page, setPage] = useState(1);

  // Sample user data for leaderboard
  const users = [
    {
      id: 1,
      rank: 1,
      name: "Alex Johnson",
      username: "alexj",
      avatar: "https://i.pravatar.cc/150?img=1",
      score: 9850,
      quizzesTaken: 42,
      accuracy: 94,
      badges: ["Quiz Master", "Science Expert"],
      country: "USA",
      status: "Elite"
    },
    {
      id: 2,
      rank: 2,
      name: "Maria Garcia",
      username: "mariag",
      avatar: "https://i.pravatar.cc/150?img=5",
      score: 9720,
      quizzesTaken: 38,
      accuracy: 92,
      badges: ["History Buff", "Perfect Score"],
      country: "Spain",
      status: "Elite"
    },
    {
      id: 3,
      rank: 3,
      name: "James Wilson",
      username: "jwilson",
      avatar: "https://i.pravatar.cc/150?img=3",
      score: 9680,
      quizzesTaken: 45,
      accuracy: 89,
      badges: ["Top Contributor", "Geography Whiz"],
      country: "UK",
      status: "Elite"
    },
    {
      id: 4,
      rank: 4,
      name: "Shreya Patel",
      username: "shreyap",
      avatar: "https://i.pravatar.cc/150?img=8",
      score: 9550,
      quizzesTaken: 36,
      accuracy: 90,
      badges: ["Quick Thinker", "Entertainment Guru"],
      country: "India",
      status: "Pro"
    },
    {
      id: 5,
      rank: 5,
      name: "Liu Wei",
      username: "liuwei",
      avatar: "https://i.pravatar.cc/150?img=6",
      score: 9480,
      quizzesTaken: 40,
      accuracy: 91,
      badges: ["Math Genius", "Science Expert"],
      country: "China",
      status: "Pro"
    },
    {
      id: 6,
      rank: 6,
      name: "Sophie Martin",
      username: "sophiem",
      avatar: "https://i.pravatar.cc/150?img=9",
      score: 9350,
      quizzesTaken: 32,
      accuracy: 88,
      badges: ["Art Connoisseur"],
      country: "France",
      status: "Pro"
    },
    {
      id: 7,
      rank: 7,
      name: "Carlos Mendez",
      username: "carlosm",
      avatar: "https://i.pravatar.cc/150?img=4",
      score: 9200,
      quizzesTaken: 30,
      accuracy: 87,
      badges: ["Sports Expert"],
      country: "Mexico",
      status: "Verified"
    },
    {
      id: 8,
      rank: 8,
      name: "Ahmed Hassan",
      username: "ahmedh",
      avatar: "https://i.pravatar.cc/150?img=2",
      score: 9100,
      quizzesTaken: 27,
      accuracy: 89,
      badges: ["Rising Star"],
      country: "Egypt",
      status: "Verified"
    },
    {
      id: 9,
      rank: 9,
      name: "Emma Thompson",
      username: "emmat",
      avatar: "https://i.pravatar.cc/150?img=7",
      score: 8950,
      quizzesTaken: 25,
      accuracy: 84,
      badges: ["Trivia Master"],
      country: "Australia",
      status: "Verified"
    },
    {
      id: 10,
      rank: 10,
      name: "Hiroshi Tanaka",
      username: "hiroshit",
      avatar: "https://i.pravatar.cc/150?img=10",
      score: 8800,
      quizzesTaken: 23,
      accuracy: 86,
      badges: ["Consistency King"],
      country: "Japan",
      status: "Verified"
    }
  ];
  // Status color mapping
  const statusColorMap: Record<string, string> = {
    Elite: "success",
    Pro: "primary",
    Verified: "secondary"
  };

  return (
    <DefaultLayout>
      {/* Header */}
      <section className="py-8 md:py-10">
        <div className="max-w-xl">
          <h1 className={title({ size: "lg" })}>Leaderboard</h1>
          <p className={subtitle({ class: "mt-4" })}>
            See where you stand against the best quiz takers from around the world.
          </p>
        </div>
      </section>

      {/* Time period & Category filters */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
          <Tabs 
            aria-label="Leaderboard Options" 
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab as any}
            color="primary"
            size="lg"
            className="w-full"
          >
            <Tab key="overall" title="Overall Ranking" />
            <Tab key="monthly" title="This Month" />
            <Tab key="weekly" title="This Week" />
            <Tab key="daily" title="Today" />
          </Tabs>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-1/3">
            <Input
              placeholder="Search by username or name..."
              startContent={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-default-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              }
              size="sm"
            />
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">            <Select 
              label="Category"
              placeholder="All Categories"
              className="w-40"
              size="sm"
            >
              <SelectItem key="all">All Categories</SelectItem>
              <SelectItem key="general">General Knowledge</SelectItem>
              <SelectItem key="science">Science</SelectItem>
              <SelectItem key="history">History</SelectItem>
              <SelectItem key="geography">Geography</SelectItem>
              <SelectItem key="entertainment">Entertainment</SelectItem>
              <SelectItem key="sports">Sports</SelectItem>
            </Select>
              <Select 
              label="Region"
              placeholder="Global"
              className="w-40"
              size="sm"
            >
              <SelectItem key="global">Global</SelectItem>
              <SelectItem key="americas">Americas</SelectItem>
              <SelectItem key="europe">Europe</SelectItem>
              <SelectItem key="asia">Asia</SelectItem>
              <SelectItem key="africa">Africa</SelectItem>
              <SelectItem key="oceania">Oceania</SelectItem>
            </Select>
          </div>
        </div>
      </section>

      {/* Leaderboard Table */}
      <section className="mb-8">
        <Table
          aria-label="Leaderboard Table"
          className="border border-default-200 rounded-lg overflow-hidden"
          removeWrapper
        >
          <TableHeader>
            <TableColumn className="text-center w-16">RANK</TableColumn>
            <TableColumn>USER</TableColumn>
            <TableColumn className="text-center">SCORE</TableColumn>
            <TableColumn className="text-center hide-on-mobile">QUIZZES</TableColumn>
            <TableColumn className="text-center hide-on-mobile">ACCURACY</TableColumn>
            <TableColumn className="hide-on-mobile">BADGES</TableColumn>
            <TableColumn className="text-center hide-on-mobile">COUNTRY</TableColumn>
            <TableColumn className="text-center">STATUS</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id} >
                <TableCell className="text-center font-bold">
                  {user.rank === 1 && (
                    <div className="flex justify-center">
                      <span className="text-xl text-warning-500">🏆</span>
                    </div>
                  )}
                  {user.rank === 2 && (
                    <div className="flex justify-center">
                      <span className="text-xl text-default-400">🥈</span>
                    </div>
                  )}
                  {user.rank === 3 && (
                    <div className="flex justify-center">
                      <span className="text-xl text-amber-600">🥉</span>
                    </div>
                  )}
                  {user.rank > 3 && user.rank}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={user.avatar}
                      showFallback
                      name={user.name.charAt(0)}
                      className={user.rank <= 3 ? "ring-2 ring-primary-500 ring-offset-2" : ""}
                    />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-default-500 text-xs">@{user.username}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold">{user.score.toLocaleString()}</TableCell>
                <TableCell className="text-center hide-on-mobile">{user.quizzesTaken}</TableCell>
                <TableCell className="text-center hide-on-mobile">{user.accuracy}%</TableCell>
                <TableCell className="hide-on-mobile">
                  <div className="flex flex-wrap gap-1">
                    {user.badges.map((badge: string, index: number) => (
                      <Chip 
                        key={index} 
                        size="sm" 
                        variant="flat" 
                        color={index % 3 === 0 ? "primary" : index % 3 === 1 ? "success" : "warning"}
                      >
                        {badge}
                      </Chip>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center hide-on-mobile">{user.country}</TableCell>
                <TableCell className="text-center">
                  <Chip
                    color={statusColorMap[user.status] as any}
                    variant="flat"
                    size="sm"
                  >
                    {user.status}
                  </Chip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      {/* Pagination */}
      <section className="flex justify-center mb-12">
        <Pagination 
          total={10} 
          page={page} 
          onChange={setPage} 
          color="primary"
          showControls
          className="mb-10"
        />
      </section>

      {/* Your Position */}
      <section className="py-8 px-4 mb-12">
        <div className="max-w-4xl mx-auto p-6 rounded-2xl border border-default-200 bg-default-50">
          <h2 className="text-xl font-bold mb-4">Your Current Position</h2>
          
          <Table 
            aria-label="Your Position"
            hideHeader
            removeWrapper
          >
            <TableHeader>
              <TableColumn className="text-center w-16">RANK</TableColumn>
              <TableColumn>USER</TableColumn>
              <TableColumn className="text-center">SCORE</TableColumn>
              <TableColumn className="text-center hide-on-mobile">QUIZZES</TableColumn>
              <TableColumn className="text-center hide-on-mobile">ACCURACY</TableColumn>
              <TableColumn className="text-center hide-on-mobile">BADGES</TableColumn>
              <TableColumn className="text-center">STATUS</TableColumn>
            </TableHeader>
            <TableBody>
              {users.slice(0, 1).map((user: any) => (
                <TableRow key={user.id} >
                  <TableCell className="text-center font-bold">
                    {user.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar}
                        showFallback
                        name={user.name.charAt(0)}
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-default-500 text-xs">@{user.username}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-bold">{user.score.toLocaleString()}</TableCell>
                  <TableCell className="text-center hide-on-mobile">{user.quizzesTaken}</TableCell>
                  <TableCell className="text-center hide-on-mobile">{user.accuracy}%</TableCell>
                  <TableCell className="hide-on-mobile">
                    {user.badges.map((badge: string, index: number) => (
                      <Chip 
                        key={index} 
                        size="sm" 
                        variant="flat" 
                        color={index % 3 === 0 ? "primary" : index % 3 === 1 ? "success" : "warning"}
                      >
                        {badge}
                      </Chip>
                    ))}
                  </TableCell>
                  <TableCell className="text-center">
                    <Chip
                      color={statusColorMap[user.status] as any}
                      variant="flat"
                      size="sm"
                    >
                      {user.status}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
            
          
          <div className="mt-6 flex justify-between items-center">
            <p className="text-default-600">Take more quizzes to improve your rank!</p>
            <Button color="primary" variant="flat" as="a" href="/quizzes">
              Browse Quizzes
            </Button>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-8 px-4 mb-8">
        <div className="max-w-4xl mx-auto text-center p-8 rounded-3xl bg-gradient-to-r from-primary-500/20 to-secondary-500/20 backdrop-blur-sm border border-default-200">
          <h2 className={title({ size: "sm" })}>Ready to climb the ranks?</h2>
          <p className="text-default-600 mt-4 mb-8 max-w-lg mx-auto">
            Challenge yourself with more quizzes, earn badges, and showcase your knowledge on the global leaderboard.
          </p>
          <Button
            as="a"
            href="/quizzes"
            color="primary"
            size="lg"
            radius="full"
            variant="shadow"
            className="font-medium"
          >
            Start a New Quiz
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

// Add this CSS to your globals.css or create a new module
// This will help with responsiveness on mobile
// @media (max-width: 768px) {
//   .hide-on-mobile {
//     display: none;
//   }
// }
