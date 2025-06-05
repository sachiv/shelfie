"use client";

import { DELETE_AUTHOR } from "@/_lib/graphql/schema/author";
import { Author } from "@/_lib/models/associations";
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
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuthorWithBooks extends Author {
  books?: {
    id: number;
    title: string;
  }[];
}

const AuthorCard = ({
  author,
  onEdit,
  onDeleted,
}: {
  author: AuthorWithBooks;
  onEdit: () => void;
  onDeleted: () => void;
}) => {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteAuthor] = useMutation(DELETE_AUTHOR);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAuthor({ variables: { id: author.id } });
      setShowDialog(false);
      onDeleted();
    } catch {
      alert("Failed to delete author.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="h-full flex flex-col relative">
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{author.name}</CardTitle>
      </CardHeader>
      <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-full border">
        {author.image ? (
          <Image
            src={author.image}
            alt={`${author.name}'s photo`}
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
          {author.biography}
        </CardDescription>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground mt-2">
            {author.books?.length || 0} Books
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex gap-2 justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/authors/${author.id}`)}
        >
          View Details
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            title="Edit Author"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => setShowDialog(true)}
                disabled={isDeleting}
                title="Delete Author"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Author</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete &quot;{author.name}&quot;?
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
      </CardFooter>
    </Card>
  );
};

export default AuthorCard;
