"use client";

import { Badge } from "@/_ui/shadcn/badge";
import { Button } from "@/_ui/shadcn/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/_ui/shadcn/form";
import { Input } from "@/_ui/shadcn/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_ui/shadcn/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/_ui/shadcn/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AuthorFiltersProps {
  onFilterChange: (filters: {
    search: string;
    sortBy: string;
    sortOrder: string;
  }) => void;
  initialFilters: {
    search: string;
    sortBy: string;
    sortOrder: string;
  };
}

export function AuthorFilters({
  onFilterChange,
  initialFilters,
}: AuthorFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: initialFilters.search,
      sortBy: initialFilters.sortBy,
      sortOrder: initialFilters.sortOrder,
    },
  });

  const handleSave = (values: FormValues) => {
    onFilterChange({
      search: values.search || "",
      sortBy: values.sortBy || "name",
      sortOrder: values.sortOrder || "asc",
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    form.reset({
      search: "",
      sortBy: "name",
      sortOrder: "asc",
    });
    onFilterChange({
      search: "",
      sortBy: "name",
      sortOrder: "asc",
    });
    setIsOpen(false);
  };

  return (
    <div className="space-y-4 flex flex-col items-end">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SearchIcon className="h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Authors</SheetTitle>
          </SheetHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-4 p-4 flex-1"
            >
              <FormField
                control={form.control}
                name="search"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Search by author name or biography..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Search by author name or biography
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort By</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sort field" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="born_date">Birth Date</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how to sort the authors
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sort order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose the sort order</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <SheetFooter className="mt-6 mb-4">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button
                className="flex-1"
                onClick={form.handleSubmit(handleSave)}
              >
                Apply Filters
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {(initialFilters.search ||
        initialFilters.sortBy !== "name" ||
        initialFilters.sortOrder !== "asc") && (
        <div className="flex flex-wrap gap-2">
          {initialFilters.search && (
            <Badge variant="secondary" className="gap-1">
              <span>Search: {initialFilters.search}</span>
              <button
                onClick={() => {
                  form.setValue("search", "");
                  onFilterChange({ ...initialFilters, search: "" });
                }}
                className="hover:bg-secondary-foreground/10 rounded-full p-1"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {initialFilters.sortBy !== "name" && (
            <Badge variant="secondary" className="gap-1">
              <span>
                Sort: {initialFilters.sortBy} ({initialFilters.sortOrder})
              </span>
              <button
                onClick={() => {
                  form.setValue("sortBy", "name");
                  form.setValue("sortOrder", "asc");
                  onFilterChange({
                    ...initialFilters,
                    sortBy: "name",
                    sortOrder: "asc",
                  });
                }}
                className="hover:bg-secondary-foreground/10 rounded-full p-1"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
