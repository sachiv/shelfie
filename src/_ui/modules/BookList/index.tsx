"use client";

import Book from "@/_lib/models/Book";
import { Loader } from "@/_ui/components/Loader";
import { Button } from "@/_ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_ui/shadcn/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/_ui/shadcn/pagination";
import { gql, useMutation, useQuery } from "@apollo/client";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { AddAuthorForm } from "./AddAuthorForm";
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

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($author: AuthorInput!) {
    createAuthor(author: $author) {
      id
      name
    }
  }
`;

const PAGE_SIZE = 12;

type AuthorInput = {
  name: string;
  biography?: string;
  born_date?: string;
};

export default function BooksList() {
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: { page, limit: PAGE_SIZE },
  });

  const [createAuthor] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_BOOKS }],
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

  const handleAddAuthor = async (values: AuthorInput) => {
    try {
      setIsSubmitting(true);
      await createAuthor({
        variables: {
          author: {
            ...values,
            born_date: values.born_date ? new Date(values.born_date) : null,
          },
        },
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 flex-1 justify-between flex flex-col py-10">
      <div className="flex justify-end mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Author
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Author</DialogTitle>
            </DialogHeader>
            <AddAuthorForm
              onSubmit={handleAddAuthor}
              isLoading={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

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
