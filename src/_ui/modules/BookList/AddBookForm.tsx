"use client";

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
import { Textarea } from "@/_ui/shadcn/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  published_date: z.string().optional(),
  author_id: z.string().min(1, {
    message: "Please select an author.",
  }),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddBookFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
  authors: Array<{ id: number; name: string }>;
  initialValues?: Partial<FormValues>;
}

export function AddBookForm({
  onSubmit,
  isLoading,
  authors,
  initialValues,
}: AddBookFormProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      published_date: "",
      author_id: "",
      image: "",
      ...initialValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Book title" {...field} />
              </FormControl>
              <FormDescription>The title of the book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Book description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief description of the book.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                The date when the book was published.
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id.toString()}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Select the author of the book.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Book Cover</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <ImageUpload
                    onImageUploaded={(path) => {
                      field.onChange(path);
                      setIsImageUploading(false);
                    }}
                    onUploadStart={() => setIsImageUploading(true)}
                    isLoading={isLoading}
                  />
                  {field.value && (
                    <div className="relative aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border">
                      <Image
                        src={field.value}
                        alt="Book cover preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => field.onChange("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Upload a cover image for the book.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isImageUploading}
        >
          {isLoading || isImageUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isImageUploading
                ? "Uploading Image..."
                : initialValues
                ? "Saving..."
                : "Adding..."}
            </>
          ) : initialValues ? (
            "Save Changes"
          ) : (
            "Add Book"
          )}
        </Button>
      </form>
    </Form>
  );
}
