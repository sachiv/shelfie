"use client";

import { GET_AUTHORS } from "@/_lib/graphql/schema/author";
import { Author } from "@/_lib/models/associations";
import { Loader } from "@/_ui/components/Loader";
import { Button } from "@/_ui/shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/_ui/shadcn/card";
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
import { useQuery } from "@apollo/client";
import { ImageIcon, PlusIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddAuthorForm } from "../BookList/AddAuthorForm";
import { AuthorFilters } from "./AuthorFilters";

interface AuthorWithBooks extends Author {
  books?: {
    id: number;
    title: string;
  }[];
}

const PAGE_SIZE = 8;

const AuthorCard = ({ author }: { author: AuthorWithBooks }) => {
  const router = useRouter();

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2">{author.name}</CardTitle>
      </CardHeader>
      <div className="relative aspect-square w-full max-w-[200px] mx-auto overflow-hidden rounded-full border">
        {author.image ? (
          <Image
            src={author.image}
            alt={`${author.name}'s photo`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
      </div>
      <CardContent>
        <CardDescription className="line-clamp-3">
          {author.biography}
        </CardDescription>
        <div className="flex justify-between">
          <p className="text-sm text-muted-foreground mt-2">
            {author.books?.length || 0} Books
          </p>
        </div>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push(`/authors/${author.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function AuthorsList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_AUTHORS, {
    variables: {
      page,
      limit: PAGE_SIZE,
      search,
      sortBy,
      sortOrder,
    },
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

        <AuthorFilters
          onFilterChange={handleFilterChange}
          initialFilters={{ search, sortBy, sortOrder }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {authors.map((author: AuthorWithBooks) => (
          <AuthorCard key={author.id} author={author} />
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
