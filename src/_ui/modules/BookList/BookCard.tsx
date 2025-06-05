import Book from "@/_lib/models/Book";
import { Button } from "@/_ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_ui/shadcn/card";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const BookCard = ({ book }: { book: Book }) => {
  const router = useRouter();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
      </CardHeader>
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {book.image ? (
          <Image
            src={book.image}
            alt={`Cover of ${book.title}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {book.description}
        </CardDescription>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground mt-2">
            By {book.author?.name || "Unknown Author"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/books/${book.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
