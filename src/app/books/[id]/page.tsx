"use client";

import { gql, useQuery } from "@apollo/client";
import { format, isValid } from "date-fns";
import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      description
      published_date
      image
      author {
        id
        name
        biography
        born_date
        image
      }
    }
  }
`;

export default function BookDetailsPage() {
  const params = useParams();
  const { loading, error, data } = useQuery(GET_BOOK, {
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
          <div className="aspect-[3/4] w-full max-w-[300px] mx-auto bg-muted rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 w-1/2 bg-muted rounded" />
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.book) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Book not found</h1>
      </div>
    );
  }

  const book = data.book;

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column - Book Cover */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
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

        {/* Right Column - Book Details */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            {book.published_date && (
              <p className="text-muted-foreground">
                Published {formatDate(book.published_date)}
              </p>
            )}
          </div>

          {book.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {book.description}
              </p>
            </div>
          )}

          {/* Author Details */}
          {book.author && (
            <div className="border-t pt-6 space-y-6">
              <h2 className="text-xl font-semibold">About the Author</h2>

              <div className="flex items-start gap-6">
                <div className="relative aspect-square w-24 overflow-hidden rounded-full border shrink-0">
                  {book.author.image ? (
                    <Image
                      src={book.author.image}
                      alt={`${book.author.name}'s photo`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{book.author.name}</h3>

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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
