import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Link } from "@heroui/link";

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  questions: number;
  timeLimit: string;
  played: number;
  rating: number;
  featured?: boolean;
  image: string;
  compact?: boolean;
}

export default function QuizCard({
  id,
  title,
  description,
  category,
  difficulty,
  questions,
  timeLimit,
  played,
  rating,
  featured = false,
  image,
  compact = false,
}: QuizCardProps) {
  return (    <Card 
      className={`border border-default-200 hover:shadow-lg transition-all duration-200 h-full w-full`}
      isPressable
    >
      <CardHeader className="p-0 overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className={`w-full ${compact ? 'h-36' : 'h-48'} object-cover transform transition-transform duration-500 hover:scale-105`}
        />
      </CardHeader>
      <CardBody className={`pb-0 ${compact ? 'p-3' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <Chip color="primary" variant="flat" size="sm">{category}</Chip>
          {featured && (
            <Chip color="warning" variant="flat" size="sm">Featured</Chip>
          )}
        </div>
        <h3 className={`${compact ? 'text-lg' : 'text-xl'} font-bold mb-2`}>{title}</h3>
        <p className={`text-default-600 ${compact ? 'text-xs' : 'text-sm'} mb-4 line-clamp-2`}>
          {description}
        </p>
        
        <div className={`grid grid-cols-2 gap-3 mb-4 ${compact ? 'text-xs' : ''}`}>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-default-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
            </svg>
            <span className={`${compact ? 'text-xs' : 'text-xs'} text-default-600`}>{questions} Questions</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-default-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`${compact ? 'text-xs' : 'text-xs'} text-default-600`}>{timeLimit}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-default-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
            <span className={`${compact ? 'text-xs' : 'text-xs'} text-default-600`}>{difficulty}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-default-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className={`${compact ? 'text-xs' : 'text-xs'} text-default-600`}>{played.toLocaleString()} Played</span>
          </div>
        </div>
      </CardBody>
      <CardFooter className={`flex justify-between items-center pt-1 ${compact ? 'p-3 pt-0' : ''}`}>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg 
              key={i} 
              xmlns="http://www.w3.org/2000/svg" 
              fill={i < Math.floor(rating) ? "currentColor" : "none"} 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className={`w-3 h-3 ${i < Math.floor(rating) ? "text-warning" : "text-default-400"}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          ))}
          <span className="text-xs text-default-600 ml-1">{rating}</span>
        </div>
        <Button 
          color="primary" 
          size={compact ? "sm" : "sm"} 
          radius="full"
          as={Link}
          href={`/quiz/${id}`}
        >
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
