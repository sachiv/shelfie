import { gql } from "@apollo/client";

const book = gql`
  type Book {
    id: Int!
    title: String!
    description: String
    published_date: String
    author_id: Int!
    author: Author
  }

  type PaginatedBooks {
    books: [Book!]!
    total: Int!
    hasMore: Boolean!
  }

  input BookInput {
    id: Int
    title: String!
    description: String
    published_date: String
    author_id: Int!
  }

  extend type Query {
    books(
      page: Int = 1
      limit: Int = 10
      search: String
      author_id: Int
      published_from: String
      published_to: String
    ): PaginatedBooks!
    book(id: Int!): Book
  }

  extend type Mutation {
    createBook(book: BookInput!): Book!
    updateBook(book: BookInput!): Book!
    deleteBook(id: Int!): Book!
  }
`;

export const GET_BOOKS = gql`
  query GetBooks(
    $page: Int!
    $limit: Int!
    $search: String
    $author_id: Int
    $published_from: String
    $published_to: String
  ) {
    books(
      page: $page
      limit: $limit
      search: $search
      author_id: $author_id
      published_from: $published_from
      published_to: $published_to
    ) {
      books {
        id
        title
        published_date
        author {
          id
          name
        }
      }
      total
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      id
      title
      published_date
      author {
        id
        name
      }
    }
  }
`;

export default book;
