import gql from "graphql-tag";

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
    ): PaginatedBooks!
    book(id: Int!): Book
  }

  extend type Mutation {
    createBook(book: BookInput!): Book!
    updateBook(book: BookInput!): Book!
    deleteBook(id: Int!): Book!
  }
`;

export default book;
