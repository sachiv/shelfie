import Book from "@/_lib/models/Book";
import { Button } from "@/_ui/shadcn/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_ui/shadcn/card";

export const BookCard = ({ book }: { book: Book }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="line-clamp-3">
          {book.description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
