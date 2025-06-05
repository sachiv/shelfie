"use client";

import { GET_AUTHOR } from "@/_lib/graphql/schema/author";
import { useQuery } from "@apollo/client";
import { format, isValid } from "date-fns";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Book {
  id: number;
  title: string;
  description?: string;
  published_date?: Date;
  image?: string;
}

export default function AuthorDetailsPage() {
  const params = useParams();
  const { loading, error, data } = useQuery(GET_AUTHOR, {
    variables: { id: parseInt(params.id as string) },
  });

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return null;
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return isValid(dateObj) ? format(dateObj, "MMMM d, yyyy") : null;
  };

  if (loading) {
    return (
      <div className="container py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-3/4 bg-muted rounded" />
          <div className="aspect-square w-full max-w-[300px] mx-auto bg-muted rounded-full" />
          <div className="space-y-4">
            <div className="h-4 w-1/2 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.author) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Author not found</h1>
      </div>
    );
  }

  const author = data.author;

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Author Image */}
        <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-full border">
          {author.image ? (
            <Image
              src={author.image}
              alt={`${author.name}'s photo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Right Column - Author Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{author.name}</h1>
            {author.born_date && (
              <p className="text-muted-foreground">
                Born {formatDate(author.born_date)}
              </p>
            )}
          </div>

          {author.biography && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Biography</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {author.biography}
              </p>
            </div>
          )}

          {/* Books Section */}
          {author.books && author.books.length > 0 && (
            <div className="border-t pt-6 space-y-6">
              <h2 className="text-xl font-semibold">Books</h2>
              <Link href={`/books/${author.books[0].id}`}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {author.books.map((book: Book) => (
                    <div
                      key={book.id}
                      className="flex gap-4 p-4 rounded-lg border"
                    >
                      <div className="relative aspect-[3/4] w-20 overflow-hidden rounded-lg border">
                        {book.image ? (
                          <Image
                            src={book.image}
                            alt={`Cover of ${book.title}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{book.title}</h3>
                        {book.published_date && (
                          <p className="text-sm text-muted-foreground">
                            {formatDate(book.published_date)}
                          </p>
                        )}
                        {book.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {book.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
