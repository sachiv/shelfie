import { GET_BOOKS } from "@/_lib/graphql/schema/book";
import { MockedResponse } from "@apollo/client/testing";
import { cleanup, waitFor } from "@testing-library/react";
import { booksMock, getAllBooksWrapper } from "../__mocks__/books";

interface Book {
  id: number;
  title: string;
  description: string;
  published_date: string;
  author_id: number;
  author: {
    id: number;
    name: string;
    biography: string;
    born_date: string;
    image: string | null;
    __typename: string;
  };
  image: string | null;
  ratings: Array<{
    rating: number;
    comment: string;
    createdAt: string;
    __typename: string;
  }>;
  created_by_id: string | null;
  __typename: string;
}

describe("GET_BOOKS", () => {
  afterEach(() => {
    cleanup();
  });

  describe("Initial State", () => {
    it("should return loading state initially", async () => {
      const { result } = getAllBooksWrapper();

      expect(result.current.loading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });
  });

  describe("Successful Data Fetching", () => {
    it("should return books data after loading", async () => {
      const { result } = getAllBooksWrapper();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data).toBeDefined();
      expect(result.current.data?.books.books).toHaveLength(5);
      expect(result.current.data?.books.total).toBe(5);
      expect(result.current.data?.books.hasMore).toBe(false);
    });

    it("should return correct book data structure", async () => {
      const { result } = getAllBooksWrapper();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstBook = result.current.data?.books.books[0];
      expect(firstBook).toHaveProperty("id");
      expect(firstBook).toHaveProperty("title");
      expect(firstBook).toHaveProperty("description");
      expect(firstBook).toHaveProperty("published_date");
      expect(firstBook).toHaveProperty("author_id");
      expect(firstBook).toHaveProperty("author");
      expect(firstBook).toHaveProperty("image");
      expect(firstBook).toHaveProperty("ratings");
      expect(firstBook).toHaveProperty("created_by_id");
    });

    it("should return correct author data structure", async () => {
      const { result } = getAllBooksWrapper();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const firstBookAuthor = result.current.data?.books.books[0].author;
      expect(firstBookAuthor).toHaveProperty("id");
      expect(firstBookAuthor).toHaveProperty("name");
      expect(firstBookAuthor).toHaveProperty("biography");
      expect(firstBookAuthor).toHaveProperty("born_date");
      expect(firstBookAuthor).toHaveProperty("image");
    });
  });

  describe("Search and Filtering", () => {
    it("should handle date range filter", async () => {
      const mockData: MockedResponse[] = [
        {
          ...booksMock,
          request: {
            ...booksMock.request,
            variables: {
              ...booksMock.request.variables,
              published_from: "1980-01-01",
              published_to: "2000-12-31",
            },
          },
        },
      ];
      const { result } = getAllBooksWrapper(mockData, {
        page: 1,
        limit: 10,
        search: "",
        author_id: null,
        published_from: new Date("1980-01-01").toISOString(),
        published_to: new Date("2000-12-31").toISOString(),
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const books = result.current.data?.books.books || [];
      books.forEach((book: Book) => {
        const publishedDate = new Date(book.published_date);
        expect(
          publishedDate.getTime() >= new Date("1980-01-01").getTime()
        ).toBe(true);
        expect(
          publishedDate.getTime() <= new Date("2000-12-31").getTime()
        ).toBe(true);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle network error", async () => {
      const mockData: MockedResponse[] = [
        {
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
          error: new Error("Network error"),
        },
      ];
      const { result } = getAllBooksWrapper(mockData, {
        page: 1,
        limit: 10,
        search: "",
        author_id: null,
        published_from: null,
        published_to: null,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.error?.message).toBe("Network error");
    });

    it("should handle empty result set", async () => {
      const mockData: MockedResponse[] = [
        {
          ...booksMock,
          request: {
            ...booksMock.request,
            variables: {
              ...booksMock.request.variables,
              search: "NonExistentBook",
            },
          },
          result: {
            data: {
              books: {
                books: [],
                total: 0,
                hasMore: false,
              },
            },
          },
        },
      ];
      const { result } = getAllBooksWrapper(mockData, {
        page: 1,
        limit: 10,
        search: "NonExistentBook",
        author_id: null,
        published_from: null,
        published_to: null,
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.data?.books.books).toHaveLength(0);
      expect(result.current.data?.books.total).toBe(0);
    });
  });
});
