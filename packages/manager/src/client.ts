import type { AppRouter } from "@assetbox/trpc/dist";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:5173/trpc",
    }),
  ],
});
