import resolvers from "@/_lib/graphql/resolvers";
import typeDefs from "@/_lib/graphql/schema";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const POST = startServerAndCreateNextHandler(server);
