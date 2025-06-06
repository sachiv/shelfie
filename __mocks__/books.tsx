import { GET_BOOKS } from "@/_lib/graphql/schema/book";
import { useQuery } from "@apollo/client";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { renderHook } from "@testing-library/react";
import React from "react";

export const booksMock = {
  request: {
    query: GET_BOOKS,
    variables: {
      page: 1,
      limit: 10,
      search: "",
      author_id: null,
      published_from: null,
      published_to: null,
    },
  },
  result: {
    data: {
      books: {
        books: [
          {
            id: 1,
            title: "Test Book",
            description: "as. asd asd asd asd",
            published_date: "2025-06-03T00:00:00.000Z",
            author_id: 4,
            author: {
              id: 4,
              name: "Agatha Christie",
              biography:
                "English writer known for her detective novels featuring Hercule Poirot and Miss Marple",
              born_date: "1890-09-15T00:00:00.000Z",
              image: null,
              __typename: "Author",
            },
            image:
              "https://gczfuqcpqztjvjzyowem.supabase.co/storage/v1/object/public/images/1749184834199.jpg",
            ratings: [],
            created_by_id: "183fa232-c24d-4b91-b24d-3bfce43a29ef",
            __typename: "Book",
          },
          {
            id: 2,
            title: "The Shining",
            description:
              "A horror novel by Stephen King about a family's winter stay at an isolated hotel",
            published_date: "1977-01-28T00:00:00.000Z",
            author_id: 3,
            author: {
              id: 3,
              name: "Stephen King",
              biography:
                "American author of horror, supernatural fiction, suspense, and fantasy novels",
              born_date: "1947-09-21T00:00:00.000Z",
              image: null,
              __typename: "Author",
            },
            image: null,
            ratings: [
              {
                rating: 5,
                comment: "A masterpiece of horror!",
                createdAt: "2024-03-15T10:30:00.000Z",
                __typename: "Rating",
              },
            ],
            created_by_id: null,
            __typename: "Book",
          },
          {
            id: 3,
            title: "A Clash of Kings",
            description: "The second book in A Song of Ice and Fire series",
            published_date: "1998-11-16T00:00:00.000Z",
            author_id: 2,
            author: {
              id: 2,
              name: "George R.R. Martin",
              biography:
                "American novelist and short story writer, best known for A Song of Ice and Fire series",
              born_date: "1948-09-20T00:00:00.000Z",
              image: null,
              __typename: "Author",
            },
            image: null,
            ratings: [
              {
                rating: 4,
                comment: "Epic fantasy at its best",
                createdAt: "2024-02-20T15:45:00.000Z",
                __typename: "Rating",
              },
            ],
            created_by_id: null,
            __typename: "Book",
          },
          {
            id: 4,
            title: "American Gods",
            description: "A fantasy novel about ancient and modern gods",
            published_date: "2001-06-19T00:00:00.000Z",
            author_id: 5,
            author: {
              id: 5,
              name: "Neil Gaiman",
              biography:
                "English author of novels, short stories, comic books, and graphic novels",
              born_date: "1960-11-10T00:00:00.000Z",
              image: null,
              __typename: "Author",
            },
            image: null,
            ratings: [],
            created_by_id: null,
            __typename: "Book",
          },
          {
            id: 5,
            title: "The Handmaid's Tale",
            description: "A dystopian novel set in a totalitarian society",
            published_date: "1985-09-01T00:00:00.000Z",
            author_id: 6,
            author: {
              id: 6,
              name: "Margaret Atwood",
              biography:
                "Canadian poet, novelist, literary critic, and environmental activist",
              born_date: "1939-11-18T00:00:00.000Z",
              image: null,
              __typename: "Author",
            },
            image: null,
            ratings: [
              {
                rating: 5,
                comment: "Powerful and thought-provoking",
                createdAt: "2024-01-10T09:15:00.000Z",
                __typename: "Rating",
              },
            ],
            created_by_id: null,
            __typename: "Book",
          },
        ],
        total: 5,
        hasMore: false,
      },
    },
  },
};

interface BookQueryVariables {
  page: number;
  limit: number;
  search: string;
  author_id: number | null;
  published_from: string | null;
  published_to: string | null;
}

export function getAllBooksWrapper(
  mockData: MockedResponse[] = [booksMock],
  variables: BookQueryVariables = {
    page: 1,
    limit: 10,
    search: "",
    author_id: null,
    published_from: null,
    published_to: null,
  }
) {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <MockedProvider mocks={mockData} addTypename={false}>
      {children}
    </MockedProvider>
  );

  const { result } = renderHook(
    () =>
      useQuery(GET_BOOKS, {
        variables,
      }),
    { wrapper }
  );

  return { result };
}
