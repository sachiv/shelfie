import { Badge } from "@/_ui/shadcn/badge";
import { Button } from "@/_ui/shadcn/button";
import { BookOpen, PenIcon } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-center py-20 px-6">
      <div className="md:mt-6 flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <Badge className="bg-primary rounded-full py-1 border-none">
            Discover Your Next Read 📚
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold !leading-[1.2] tracking-tight">
            Your Personal Book Discovery Platform
          </h1>
          <p className="mt-6 max-w-[60ch] xs:text-lg">
            Explore a vast collection of books, discover new authors, and build
            your reading list. Search, filter, and find your next favorite book
            with ease.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center sm:justify-center gap-4">
            <Link href="/books">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-full text-base"
              >
                <BookOpen className="!h-5 !w-5" /> Browse Books
              </Button>
            </Link>
            <Link href="/authors">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-full text-base shadow-none"
              >
                <PenIcon className="!h-5 !w-5" /> Meet Authors
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
