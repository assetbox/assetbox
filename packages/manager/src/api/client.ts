import type { AppRouter } from "@assetbox/trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";

export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:6000/trpc",
    }),
  ],
});
