"use client";

import { ADD_BOOK_RATING } from "@/_lib/graphql/schema/book";
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
import { Textarea } from "@/_ui/shadcn/textarea";
import { gql, useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Rating {
  rating: number;
  comment: string;
  createdAt: string;
}

const GET_BOOK_RATINGS = gql`
  query GetBookRatings($id: Int!) {
    book(id: $id) {
      id
      ratings {
        rating
        comment
        createdAt
      }
    }
  }
`;

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, {
    message: "Please enter a comment.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface BookCommentsProps {
  bookId: number;
}

export function BookComments({ bookId }: BookCommentsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, refetch } = useQuery(GET_BOOK_RATINGS, {
    variables: { id: bookId },
  });

  const [addRating] = useMutation(ADD_BOOK_RATING);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await addRating({
        variables: {
          bookId,
          rating: {
            rating: values.rating,
            comment: values.comment,
          },
        },
      });

      form.reset();
      refetch(); // Refresh the ratings list
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratings = data?.book?.ratings || [];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Review</h2>

      {/* Existing Reviews */}
      {ratings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="space-y-4">
            {ratings.map((rating: Rating, index: number) => (
              <div key={index} className="rounded-lg border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format(new Date(rating.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                <p className="text-sm">{rating.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Button
                        key={star}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => field.onChange(star)}
                        className="h-8 w-8"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            star <= field.value
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </Button>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Click on the stars to rate this book.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share your thoughts about this book..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write a review to help others decide if they should read this
                  book.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
