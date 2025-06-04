import gql from "graphql-tag";
import author from "./author";
import book from "./book";

const rootType = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;

const typeDefs = [rootType, book, author];

export default typeDefs;
