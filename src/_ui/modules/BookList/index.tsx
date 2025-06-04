"use client";

import Book from "@/_lib/models/Book";
import { Loader } from "@/_ui/components/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/_ui/shadcn/pagination";
import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import { BookCard } from "./BookCard";

const GET_BOOKS = gql`
  query GetBooks($page: Int, $limit: Int) {
    books(page: $page, limit: $limit) {
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
      total
      hasMore
    }
  }
`;

const PAGE_SIZE = 12;

export default function BooksList() {
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: { page, limit: PAGE_SIZE },
  });

  if (loading && !data)
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

  const totalPages = Math.ceil(data.books.total / PAGE_SIZE);

  return (
    <div className="space-y-6 flex-1 justify-between flex flex-col py-10">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.books.books.map((book: Book) => (
          <li key={book.id}>
            <BookCard book={book} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(pageNum);
                    }}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
