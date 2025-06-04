import gql from "graphql-tag";

export const typeDefs = gql`
  type Book {
    id: Int!
    title: String!
    description: String
    published_date: String
    author_id: Int!
    author: Author
  }

  type Author {
    id: Int!
    name: String!
    biography: String
    born_date: String
    # Optionally, you can add a list of books if you want the reverse relation
    # books: [Book!]
  }

  input BookInput {
    id: Int
    title: String!
    description: String
    published_date: String
    author_id: Int!
  }

  input AuthorInput {
    id: Int
    name: String!
    biography: String
    born_date: String
  }

  type Query {
    books: [Book!]!
    book(id: Int!): Book
    authors: [Author!]!
    author(id: Int!): Author
  }

  type Mutation {
    createBook(book: BookInput!): Book!
    updateBook(book: BookInput!): Book!
    deleteBook(id: Int!): Book!
    createAuthor(author: AuthorInput!): Author!
    updateAuthor(author: AuthorInput!): Author!
    deleteAuthor(id: Int!): Author!
  }
`;
