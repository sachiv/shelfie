"use client";

import { CREATE_AUTHOR, GET_AUTHOR_NAMES } from "@/_lib/graphql/schema/author";
import {
  CREATE_BOOK,
  GET_BOOKS,
  UPDATE_BOOK,
} from "@/_lib/graphql/schema/book";
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
import { useMutation, useQuery } from "@apollo/client";
import { useUser } from "@stackframe/stack";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AddAuthorForm } from "./AddAuthorForm";
import { AddBookForm } from "./AddBookForm";
import { BookCard } from "./BookCard";
import { BookFilters } from "./BookFilters";

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
  image?: string;
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
  const [editBook, setEditBook] = useState<Book | null>(null);
  const user = useUser();

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

  const { data: authorsData, refetch: refetchAuthors } =
    useQuery(GET_AUTHOR_NAMES);

  const [createAuthor] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_BOOKS }, { query: GET_AUTHOR_NAMES }],
  });

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS }],
  });

  const [updateBook] = useMutation(UPDATE_BOOK, {
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

  const handleEditBook = async (values: BookFormValues) => {
    if (!editBook) return;
    try {
      setIsSubmitting(true);
      await updateBook({
        variables: {
          book: {
            ...values,
            id: editBook.id,
            author_id: parseInt(values.author_id),
            published_date: values.published_date
              ? new Date(values.published_date)
              : null,
          },
        },
      });
      setEditBook(null);
      await refetchBooks();
    } catch (error) {
      console.error("Error updating book:", error);
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
        {user ? (
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
                  authors={authorsData?.authors?.authors || []}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div />
        )}

        <BookFilters
          onFilterChange={handleFilterChange}
          activeFilters={filters}
          authors={authorsData?.authors?.authors || []}
        />
      </div>

      <Dialog
        open={!!editBook}
        onOpenChange={(open) => !open && setEditBook(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          {editBook && (
            <AddBookForm
              onSubmit={handleEditBook}
              isLoading={isSubmitting}
              authors={authorsData?.authors?.authors || []}
              initialValues={{
                title: editBook.title,
                description: editBook.description || "",
                published_date: editBook.published_date
                  ? new Date(editBook.published_date).toISOString().slice(0, 10)
                  : "",
                author_id: String(editBook.author_id),
                image: editBook.image || "",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {booksData.books.books.map((book: Book) => (
          <li key={book.id} className="relative group">
            <BookCard
              book={book}
              onDeleted={() => refetchBooks()}
              onEdit={() => setEditBook(book)}
            />
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
