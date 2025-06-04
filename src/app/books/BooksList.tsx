"use client";

import { gql, useQuery } from "@apollo/client";

const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      description
      published_date
      author_id
    }
  }
`;

type Book = {
  id: number;
  title: string;
  description?: string;
  published_date?: string;
  author_id: number;
};

export default function BooksList() {
  const { data, loading, error } = useQuery(GET_BOOKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.books.map((book: Book) => (
        <li key={book.id}>{book.title}</li>
      ))}
    </ul>
  );
}
