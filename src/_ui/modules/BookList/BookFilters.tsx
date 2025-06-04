"use client";

import { cn } from "@/_lib/utils";
import { Badge } from "@/_ui/shadcn/badge";
import { Button } from "@/_ui/shadcn/button";
import { Calendar } from "@/_ui/shadcn/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/_ui/shadcn/popover";
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
import { format } from "date-fns";
import { CalendarIcon, SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  search: z.string().optional(),
  author_id: z.string().optional(),
  published_date: z
    .object({
      from: z.date(),
      to: z.date().optional(),
    })
    .optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BookFiltersProps {
  onFilterChange: (filters: {
    search: string;
    author_id?: number;
    published_date?: DateRange;
  }) => void;
  activeFilters: {
    search: string;
    author_id?: number;
    published_date?: DateRange;
  };
  authors: Array<{ id: number; name: string }>;
}

export function BookFilters({
  onFilterChange,
  activeFilters,
  authors,
}: BookFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: activeFilters.search,
      author_id: activeFilters.author_id?.toString() || "all",
      published_date: activeFilters.published_date,
    },
  });

  const handleSave = (values: FormValues) => {
    onFilterChange({
      search: values.search || "",
      author_id:
        values.author_id && values.author_id !== "all"
          ? parseInt(values.author_id)
          : undefined,
      published_date: values.published_date,
    });
    setIsOpen(false);
  };

  const clearFilters = () => {
    form.reset({
      search: "",
      author_id: "all",
      published_date: undefined,
    });
    onFilterChange({
      search: "",
      author_id: undefined,
      published_date: undefined,
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
            <SheetTitle>Filter Books</SheetTitle>
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
                        placeholder="Search by book or author name..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Search by book title or author name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Authors</SelectItem>
                        {authors.map((author) => (
                          <SelectItem
                            key={author.id}
                            value={author.id.toString()}
                          >
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Filter books by a specific author
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="published_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Published Date Range</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value?.from ? (
                              field.value.to ? (
                                <>
                                  {format(field.value.from, "LLL dd, y")} -{" "}
                                  {format(field.value.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(field.value.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value?.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Filter books by their publication date range
                    </FormDescription>
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

      {(activeFilters.search ||
        activeFilters.author_id ||
        activeFilters.published_date) && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.search && (
            <Badge variant="secondary" className="gap-1">
              <span>Search: {activeFilters.search}</span>
              <button
                onClick={() => {
                  form.setValue("search", "");
                  onFilterChange({ ...activeFilters, search: "" });
                }}
                className="hover:bg-secondary-foreground/10 rounded-full p-1"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeFilters.author_id && (
            <Badge variant="secondary" className="gap-1">
              <span>
                Author:{" "}
                {authors.find((a) => a.id === activeFilters.author_id)?.name}
              </span>
              <button
                onClick={() => {
                  form.setValue("author_id", "all");
                  onFilterChange({ ...activeFilters, author_id: undefined });
                }}
                className="hover:bg-secondary-foreground/10 rounded-full p-1"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {activeFilters.published_date && (
            <Badge variant="secondary" className="gap-1">
              <span>
                Published:{" "}
                {activeFilters.published_date.from &&
                activeFilters.published_date.to
                  ? `${format(
                      activeFilters.published_date.from,
                      "MMM d, y"
                    )} - ${format(activeFilters.published_date.to, "MMM d, y")}`
                  : activeFilters.published_date.from
                  ? `From ${format(
                      activeFilters.published_date.from,
                      "MMM d, y"
                    )}`
                  : `Until ${format(
                      activeFilters.published_date.to!,
                      "MMM d, y"
                    )}`}
              </span>
              <button
                onClick={() => {
                  form.setValue("published_date", undefined);
                  onFilterChange({
                    ...activeFilters,
                    published_date: undefined,
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
