"use client";

import { GET_AUTHORS, UPDATE_AUTHOR } from "@/_lib/graphql/schema/author";
import { Author } from "@/_lib/models/associations";
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
import { AddAuthorForm } from "../BookList/AddAuthorForm";
import AuthorCard from "./AuthorCard";
import { AuthorFilters } from "./AuthorFilters";

interface AuthorWithBooks extends Author {
  books?: {
    id: number;
    title: string;
  }[];
}

const PAGE_SIZE = 8;

type AuthorFormValues = {
  name: string;
  biography?: string;
  born_date?: string;
  image?: string;
};

export default function AuthorsList() {
  const user = useUser();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editAuthor, setEditAuthor] = useState<AuthorWithBooks | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_AUTHORS, {
    variables: {
      page,
      limit: PAGE_SIZE,
      search,
      sortBy,
      sortOrder,
    },
  });

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }],
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (filters: {
    search: string;
    sortBy: string;
    sortOrder: string;
  }) => {
    setSearch(filters.search);
    setSortBy(filters.sortBy);
    setSortOrder(filters.sortOrder);
    setPage(1);
  };

  const handleAuthorAdded = () => {
    setIsAddDialogOpen(false);
    refetch();
  };

  const handleEditAuthor = async (values: AuthorFormValues) => {
    if (!editAuthor) return;
    try {
      setIsSubmitting(true);
      await updateAuthor({
        variables: {
          author: {
            ...values,
            id: editAuthor.id,
            born_date: values.born_date ? new Date(values.born_date) : null,
          },
        },
      });
      setEditAuthor(null);
      refetch();
    } catch (error) {
      console.error("Error updating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="size-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Error: {error.message}
      </div>
    );
  }

  const { authors, totalPages } = data.authors;

  return (
    <div className="space-y-6 flex-1 flex flex-col py-10">
      <div className="flex justify-between items-start gap-4 mb-4">
        {user ? (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              <AddAuthorForm onSubmit={handleAuthorAdded} />
            </DialogContent>
          </Dialog>
        ) : (
          <div />
        )}

        <AuthorFilters
          onFilterChange={handleFilterChange}
          initialFilters={{ search, sortBy, sortOrder }}
        />
      </div>

      <Dialog
        open={!!editAuthor}
        onOpenChange={(open) => !open && setEditAuthor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Author</DialogTitle>
          </DialogHeader>
          {editAuthor && (
            <AddAuthorForm
              onSubmit={handleEditAuthor}
              isLoading={isSubmitting}
              initialValues={{
                name: editAuthor.name,
                biography: editAuthor.biography || "",
                born_date: editAuthor.born_date
                  ? new Date(editAuthor.born_date).toISOString().slice(0, 10)
                  : "",
                image: editAuthor.image || "",
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {authors.map((author: AuthorWithBooks) => (
          <AuthorCard
            key={author.id}
            author={author}
            onEdit={() => setEditAuthor(author)}
            onDeleted={refetch}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) handlePageChange(page - 1);
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
                      handlePageChange(pageNum);
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
                  if (page < totalPages) handlePageChange(page + 1);
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
