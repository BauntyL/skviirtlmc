import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-8">The page you are looking for does not exist.</p>
      <Link href="/" className="text-primary hover:underline">
        Go Home
      </Link>
    </div>
  );
}