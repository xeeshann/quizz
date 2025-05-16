import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

import DefaultLayout from "@/layouts/default";

export default function NotFoundPage() {
  return (
    <DefaultLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary">404</h1>
          <div className="w-16 h-1 bg-primary mx-auto my-4"></div>
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-default-600 max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            as={Link}
            href="/"
            color="primary"
            size="lg"
          >
            Return Home
          </Button>
          
          <Button
            as={Link}
            href="/quizzes"
            variant="flat"
            size="lg"
          >
            Browse Quizzes
          </Button>
        </div>
        
        <div className="mt-16 p-6 bg-default-50 rounded-xl border border-default-200 max-w-2xl">
          <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Link href="/quizzes" className="p-3 rounded-lg bg-default-100 hover:bg-primary/10 transition-colors">
              <div className="text-2xl mb-1">🧠</div>
              <p className="font-medium">Quizzes</p>
            </Link>
            <Link href="/leaderboard" className="p-3 rounded-lg bg-default-100 hover:bg-primary/10 transition-colors">
              <div className="text-2xl mb-1">🏆</div>
              <p className="font-medium">Leaderboard</p>
            </Link>
            <Link href="/profile" className="p-3 rounded-lg bg-default-100 hover:bg-primary/10 transition-colors">
              <div className="text-2xl mb-1">👤</div>
              <p className="font-medium">Profile</p>
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
