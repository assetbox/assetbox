import { initTRPC } from "@trpc/server";
import { error } from "console";
import { unlink } from "fs/promises";
import { z } from "zod";
export const t = initTRPC.create();
export const appRouter = t.router({
  getUser: t.procedure
    //   .input(
    //     z.object({
    //       name: z.string(),
    //     })
    //   )
    .input(z.string())
    .query((req) => {
      return { id: req.input, name: "Bilbo" };
    }),
  deleteAsset: t.procedure.input(z.string()).mutation(async (req) => {
    try {
      await unlink(req.input);
    } catch (e) {
      throw new Error("File deletion error");
    }
    return req.input;
  }),
});
