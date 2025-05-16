import { Spinner } from "@heroui/spinner";

interface LoadingSpinnerProps {
  message?: string;
}

const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <Spinner size="lg" color="primary" />
      <p className="mt-4 text-default-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
