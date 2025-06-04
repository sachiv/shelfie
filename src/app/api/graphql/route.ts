import resolvers from "@/_lib/graphql/resolvers";
import typeDefs from "@/_lib/graphql/schema";
import "@/_lib/models";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
    console.error("GraphQL Error:", err);
    return err;
  },
});

export const POST = startServerAndCreateNextHandler(server);
