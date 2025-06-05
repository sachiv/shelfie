import gql from "graphql-tag";

const author = gql`
  type Author {
    id: Int!
    name: String!
    biography: String
    born_date: String
    image: String
  }

  input AuthorInput {
    id: Int
    name: String!
    biography: String
    born_date: String
    image: String
  }

  extend type Query {
    authors: [Author!]!
    author(id: Int!): Author
  }

  extend type Mutation {
    createAuthor(author: AuthorInput!): Author!
    updateAuthor(author: AuthorInput!): Author!
    deleteAuthor(id: Int!): Author!
  }
`;

export default author;
