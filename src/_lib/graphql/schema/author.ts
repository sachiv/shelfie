import { gql } from "@apollo/client";

const author = gql`
  scalar DateTime

  type Author {
    id: Int!
    name: String!
    biography: String
    born_date: DateTime
    image: String
    books: [Book!]
  }

  type PaginatedAuthors {
    authors: [Author!]!
    total: Int!
    totalPages: Int!
  }

  input AuthorInput {
    id: Int
    name: String!
    biography: String
    born_date: DateTime
    image: String
  }

  extend type Query {
    authors(
      page: Int = 1
      limit: Int = 10
      search: String
      sortBy: String
      sortOrder: String
    ): PaginatedAuthors!
    author(id: Int!): Author
  }

  extend type Mutation {
    createAuthor(author: AuthorInput!): Author!
    updateAuthor(author: AuthorInput!): Author!
    deleteAuthor(id: Int!): Author!
  }
`;

export const GET_AUTHORS = gql`
  query GetAuthors(
    $page: Int!
    $limit: Int!
    $search: String
    $sortBy: String
    $sortOrder: String
  ) {
    authors(
      page: $page
      limit: $limit
      search: $search
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      authors {
        id
        name
        biography
        born_date
        image
        books {
          id
          title
        }
      }
      total
      totalPages
    }
  }
`;

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($author: AuthorInput!) {
    createAuthor(author: $author) {
      id
      name
      biography
      born_date
      image
    }
  }
`;

export const GET_AUTHOR = gql`
  query GetAuthor($id: Int!) {
    author(id: $id) {
      id
      name
      biography
      born_date
      image
      books {
        id
        title
        description
        published_date
        image
      }
    }
  }
`;

export const GET_AUTHOR_NAMES = gql`
  query GetAuthorNames {
    authors(page: 1, limit: 1000) {
      authors {
        id
        name
      }
    }
  }
`;

export default author;
