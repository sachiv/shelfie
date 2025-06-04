"use client";

import { Button } from "@/_ui/shadcn/button";
import { Input } from "@/_ui/shadcn/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/_ui/shadcn/sheet";
import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface BookFiltersProps {
  onFilterChange: (filters: { search: string }) => void;
  activeFilters: { search: string };
}

export function BookFilters({
  onFilterChange,
  activeFilters,
}: BookFiltersProps) {
  const [search, setSearch] = useState(activeFilters.search);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  const handleSave = () => {
    onFilterChange({ search });
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSearch("");
    onFilterChange({ search: "" });
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
          <div className="space-y-4 p-4 flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by book or author name..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter className="mt-6 mb-4">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button className="flex-1" onClick={handleSave}>
                Apply Filters
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {activeFilters.search && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.search && (
            <div className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm">
              <span>Search: {activeFilters.search}</span>
              <button
                onClick={() => {
                  setSearch("");
                  onFilterChange({ search: "" });
                }}
                className="hover:bg-secondary-foreground/10 rounded-full p-1"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
