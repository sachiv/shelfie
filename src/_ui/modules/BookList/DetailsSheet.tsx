"use client";

import { Author } from "@/_lib/models/associations";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/_ui/shadcn/sheet";
import { format, isValid } from "date-fns";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface Book {
  id: number;
  title: string;
  description?: string;
  published_date?: Date;
  image?: string;
  author?: Author;
}

interface DetailsSheetProps {
  book: Book;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsSheet({
  book,
  isOpen,
  onOpenChange,
}: DetailsSheetProps) {
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    console.log("##", { dateObj, book });
    return isValid(dateObj) ? format(dateObj, "MMMM d, yyyy") : null;
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{book.title}</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8 px-8 pb-8">
          {/* Book Cover */}
          <div className="relative aspect-[3/4] w-full max-w-[300px] mx-auto overflow-hidden rounded-lg border">
            {book.image ? (
              <Image
                src={book.image}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Book Details */}
          <div className="space-y-4">
            {book.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {book.description}
                </p>
              </div>
            )}

            {book.published_date && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Published</h3>
                <p className="text-muted-foreground">
                  {formatDate(book.published_date)}
                </p>
              </div>
            )}
          </div>

          {/* Author Details */}
          {book.author && (
            <div className="border-t pt-6 space-y-6">
              <h2 className="text-xl font-semibold">About the Author</h2>

              {/* Author Image */}
              <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-full border">
                {book.author.image ? (
                  <Image
                    src={book.author.image}
                    alt={`${book.author.name}'s photo`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">
                  {book.author.name}
                </h3>

                {book.author.biography && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Biography</h4>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {book.author.biography}
                    </p>
                  </div>
                )}

                {book.author.born_date && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Born</h4>
                    <p className="text-muted-foreground">
                      {formatDate(book.author.born_date)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
