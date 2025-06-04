"use client";

import Book from "@/_lib/models/Book";
import { Loader } from "@/_ui/components/Loader";
import { gql, useQuery } from "@apollo/client";
import { BookCard } from "./BookCard";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      description
      published_date
      author_id
      author {
        id
        name
      }
    }
  }
`;

export default function BooksList() {
  const { data, loading, error } = useQuery(GET_BOOKS);

  if (loading)
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="size-16" />
      </div>
    );

  if (error)
    return (
      <div className="flex-1 flex items-center justify-center">
        Error: {error.message}
      </div>
    );

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.books.map((book: Book) => (
        <li key={book.id}>
          <BookCard book={book} />
        </li>
      ))}
    </ul>
  );
}
