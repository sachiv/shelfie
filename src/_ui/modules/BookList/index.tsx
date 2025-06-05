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
import { DateRange } from "react-day-picker";
import { AddAuthorForm } from "./AddAuthorForm";
import { AddBookForm } from "./AddBookForm";
import { BookCard } from "./BookCard";
import { BookFilters } from "./BookFilters";

const GET_BOOKS = gql`
  query GetBooks(
    $page: Int
    $limit: Int
    $search: String
    $author_id: Int
    $published_from: DateTime
    $published_to: DateTime
  ) {
    books(
      page: $page
      limit: $limit
      search: $search
      author_id: $author_id
      published_from: $published_from
      published_to: $published_to
    ) {
      books {
        id
        title
        description
        published_date
        author_id
        author {
          id
          name
          biography
          born_date
          image
        }
        image
      }
      total
      hasMore
    }
  }
`;

const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      id
      name
      biography
      born_date
      image
    }
  }
`;

const CREATE_AUTHOR = gql`
  mutation CreateAuthor($author: AuthorInput!) {
    createAuthor(author: $author) {
      id
      name
      biography
      born_date
      image
    }
  }
`;

const CREATE_BOOK = gql`
  mutation CreateBook($book: BookInput!) {
    createBook(book: $book) {
      id
      title
      description
      published_date
      author_id
      author {
        id
        name
      }
      image
    }
  }
`;

const PAGE_SIZE = 12;

type AuthorInput = {
  name: string;
  biography?: string;
  born_date?: string;
};

type BookFormValues = {
  title: string;
  description?: string;
  published_date?: string;
  author_id: string;
};

interface Filters {
  search: string;
  author_id?: number;
  published_date?: DateRange;
}

export default function BooksList() {
  const [page, setPage] = useState(1);
  const [isAuthorDialogOpen, setIsAuthorDialogOpen] = useState(false);
  const [isBookDialogOpen, setIsBookDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    author_id: undefined,
    published_date: undefined,
  });

  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
    refetch: refetchBooks,
  } = useQuery(GET_BOOKS, {
    variables: {
      page,
      limit: PAGE_SIZE,
      search: filters.search || undefined,
      author_id: filters.author_id,
      published_from: filters.published_date?.from,
      published_to: filters.published_date?.to,
    },
  });

  const { data: authorsData, refetch: refetchAuthors } = useQuery(GET_AUTHORS);

  const [createAuthor] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHORS }],
  });

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  if (booksLoading && !booksData)
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="size-16" />
      </div>
    );

  if (booksError)
    return (
      <div className="flex-1 flex items-center justify-center">
        Error: {booksError.message}
      </div>
    );

  const totalPages = Math.ceil(booksData.books.total / PAGE_SIZE);

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
      await refetchAuthors();
      setIsAuthorDialogOpen(false);
    } catch (error) {
      console.error("Error creating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddBook = async (values: BookFormValues) => {
    try {
      setIsSubmitting(true);
      await createBook({
        variables: {
          book: {
            ...values,
            author_id: parseInt(values.author_id),
            published_date: values.published_date
              ? new Date(values.published_date)
              : null,
          },
        },
      });
      setPage(1);
      await refetchBooks({
        page: 1,
        limit: PAGE_SIZE,
        search: filters.search || undefined,
        author_id: filters.author_id,
        published_from: filters.published_date?.from,
        published_to: filters.published_date?.to,
      });
      setIsBookDialogOpen(false);
    } catch (error) {
      console.error("Error creating book:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
    refetchBooks({
      page: 1,
      limit: PAGE_SIZE,
      search: newFilters.search || undefined,
      author_id: newFilters.author_id,
      published_from: newFilters.published_date?.from,
      published_to: newFilters.published_date?.to,
    });
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col py-10">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex gap-4">
          <Dialog
            open={isAuthorDialogOpen}
            onOpenChange={setIsAuthorDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="outline">
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

          <Dialog open={isBookDialogOpen} onOpenChange={setIsBookDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <AddBookForm
                onSubmit={handleAddBook}
                isLoading={isSubmitting}
                authors={authorsData?.authors || []}
              />
            </DialogContent>
          </Dialog>
        </div>

        <BookFilters
          onFilterChange={handleFilterChange}
          activeFilters={filters}
          authors={authorsData?.authors || []}
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {booksData.books.books.map((book: Book) => (
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
