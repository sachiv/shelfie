"use client";

import createApolloClient from "@/_lib/graphql/client";
import { ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";

export default function ApolloWrapper({ children }: { children: ReactNode }) {
  const client = createApolloClient();
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
