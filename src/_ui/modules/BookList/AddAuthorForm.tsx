"use client";

import { CREATE_AUTHOR } from "@/_lib/graphql/schema/author";
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
import { Textarea } from "@/_ui/shadcn/textarea";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ImageUpload } from "./ImageUpload";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  biography: z.string().optional(),
  born_date: z.string().optional(),
  image: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddAuthorFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
}

export function AddAuthorForm({ onSubmit, isLoading }: AddAuthorFormProps) {
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createAuthor] = useMutation(CREATE_AUTHOR);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      biography: "",
      born_date: "",
      image: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
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
      onSubmit(values);
    } catch (error) {
      console.error("Error creating author:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUploaded = (path: string) => {
    form.setValue("image", path, { shouldDirty: true });
    setIsImageUploading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormDescription>The full name of the author.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="biography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Author's biography"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A brief biography of the author.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="born_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                The author&apos;s date of birth.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <ImageUpload
                    onImageUploaded={handleImageUploaded}
                    onUploadStart={() => setIsImageUploading(true)}
                    isLoading={isLoading}
                  />
                  {field.value && (
                    <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-full border">
                      <Image
                        src={field.value}
                        alt="Author photo preview"
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
              <FormDescription>Upload an image of the author.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isImageUploading || isSubmitting}
        >
          {isLoading || isImageUploading || isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isImageUploading ? "Uploading Image..." : "Adding..."}
            </>
          ) : (
            "Add Author"
          )}
        </Button>
      </form>
    </Form>
  );
}
