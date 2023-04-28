import { initTRPC } from "@trpc/server";
import { z } from "zod";

export const t = initTRPC.create();
export const appRouter = t.router({
  // getUser: t.procedure
  //   .input(
  //     z.object({
  //       name: z.string(),
  //     })
  //   )
  //   .input(z.string())
  //   .query((req) => {
  //     return { id: req.input, name: "Bilbo" };
  //   }),
});

export type AppRouter = typeof appRouter;
