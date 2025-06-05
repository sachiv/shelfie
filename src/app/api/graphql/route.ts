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

// This wrapper ensures compatibility with Next.js app directory route expectations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request, _context: unknown) {
  // context is required by Next.js, but not used by Apollo
  return startServerAndCreateNextHandler(server)(request);
}
