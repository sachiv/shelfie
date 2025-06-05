import resolvers from "@/_lib/graphql/resolvers";
import typeDefs from "@/_lib/graphql/schema";
import "@/_lib/models/associations";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

// Add this global cache
declare global {
  // eslint-disable-next-line no-var
  var apolloServer: ApolloServer | undefined;
}

let server = globalThis.apolloServer;
if (!server) {
  server = globalThis.apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      console.error("GraphQL Error:", err);
      return err;
    },
  });
}

// This wrapper ensures compatibility with Next.js app directory route expectations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request, _context: unknown) {
  // server is always defined here
  return startServerAndCreateNextHandler(server!)(request);
}
