import { DELETE_BOOK } from "@/_lib/graphql/schema/book";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_ui/shadcn/dialog";
import { useMutation } from "@apollo/client";
import { useUser } from "@stackframe/stack";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const BookCard = ({
  book,
  onDeleted,
  onEdit,
}: {
  book: Book;
  onDeleted?: () => void;
  onEdit?: () => void;
}) => {
  const router = useRouter();
  const user = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [deleteBook] = useMutation(DELETE_BOOK);

  if (book.created_by_id)
    console.log("##", { user, created_by_id: book.created_by_id });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteBook({ variables: { id: book.id } });
      setShowDialog(false);
      if (onDeleted) onDeleted();
    } catch {
      alert("Failed to delete book.");
    } finally {
      setIsDeleting(false);
    }
  };

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
      <CardFooter className="mt-auto flex gap-2 justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/books/${book.id}`)}
        >
          View Details
        </Button>
        {user && user.id === book.created_by_id && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit?.()}>
              <Pencil className="h-5 w-5" />
            </Button>
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setShowDialog(true)}
                  disabled={isDeleting}
                  title="Delete Book"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Book</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete &quot;{book.title}&quot;?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
