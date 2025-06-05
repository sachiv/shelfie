import { gql } from "@apollo/client";

const book = gql`
  scalar DateTime

  type Rating {
    rating: Int!
    comment: String!
    createdAt: DateTime
  }

  type Book {
    id: Int!
    title: String!
    description: String
    published_date: DateTime
    author_id: Int!
    author: Author
    image: String
    created_by_id: String
    ratings: [Rating!]
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
    published_date: DateTime
    author_id: Int!
    image: String
    created_by_id: String
  }

  input RatingInput {
    rating: Int!
    comment: String!
    createdAt: DateTime
  }

  extend type Query {
    books(
      page: Int = 1
      limit: Int = 10
      search: String
      author_id: Int
      published_from: DateTime
      published_to: DateTime
    ): PaginatedBooks!
    book(id: Int!): Book
  }

  extend type Mutation {
    createBook(book: BookInput!): Book!
    updateBook(book: BookInput!): Book!
    deleteBook(id: Int!): Book!
    addBookRating(bookId: Int!, rating: RatingInput!): Book!
  }
`;

export const GET_BOOKS = gql`
  query GetBooks(
    $page: Int!
    $limit: Int!
    $search: String
    $author_id: Int
    $published_from: DateTime
    $published_to: DateTime
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
        description
        published_date
        author_id
        author {
          id
          name
          biography
          born_date
          image
        }
        image
        ratings {
          rating
          comment
          createdAt
        }
        created_by_id
      }
      total
      hasMore
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: Int!) {
    book(id: $id) {
      id
      title
      description
      published_date
      author_id
      author {
        id
        name
        biography
        born_date
        image
      }
      image
      ratings {
        rating
        comment
        createdAt
      }
      created_by_id
    }
  }
`;

export const CREATE_BOOK = gql`
  mutation CreateBook($book: BookInput!) {
    createBook(book: $book) {
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

export const ADD_BOOK_RATING = gql`
  mutation AddBookRating($bookId: Int!, $rating: RatingInput!) {
    addBookRating(bookId: $bookId, rating: $rating) {
      id
      ratings {
        rating
        comment
        createdAt
      }
    }
  }
`;

export const DELETE_BOOK = gql`
  mutation DeleteBook($id: Int!) {
    deleteBook(id: $id) {
      id
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook($book: BookInput!) {
    updateBook(book: $book) {
      id
      title
      description
      published_date
      author_id
      image
      author {
        id
        name
      }
    }
  }
`;

export default book;
