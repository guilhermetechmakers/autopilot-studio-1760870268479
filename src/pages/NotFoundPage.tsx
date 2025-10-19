import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center animate-fade-in-up">
        <Link to="/" className="inline-flex items-center gap-2 mb-8">
          <Sparkles className="h-8 w-8 text-accent-green" />
          <span className="text-2xl font-bold">Autopilot Studio</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-9xl font-bold text-accent-green mb-4">404</h1>
          <h2 className="text-3xl font-bold mb-4">Page not found</h2>
          <p className="text-muted text-lg mb-8">
            Sorry, we couldn't find the page you're looking for. 
            It might have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/">
            <Button className="bg-accent-green text-background hover:bg-accent-green/90">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <p className="text-sm text-muted mb-4">
            Or search for what you're looking for:
          </p>
          <div className="flex gap-2">
            <Input 
              placeholder="Search..." 
              className="bg-card"
            />
            <Button variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted mb-4">Need help?</p>
          <div className="flex gap-4 justify-center text-sm">
            <Link to="/docs" className="text-accent-green hover:underline">
              Documentation
            </Link>
            <Link to="/support" className="text-accent-green hover:underline">
              Contact Support
            </Link>
            <Link to="/status" className="text-accent-green hover:underline">
              System Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
