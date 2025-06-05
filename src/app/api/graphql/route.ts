import resolvers from "@/_lib/graphql/resolvers";
import typeDefs from "@/_lib/graphql/schema";
import { stackServerApp } from "@/stack";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

// This wrapper ensures compatibility with Next.js app directory route expectations
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request, _context: unknown) {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      console.error("GraphQL Error:", err);
      return err;
    },
  });

  const handler = startServerAndCreateNextHandler(server, {
    context: async () => {
      const user = await stackServerApp.getUser();
      return { user: user || undefined };
    },
  });

  return handler(request);
}
