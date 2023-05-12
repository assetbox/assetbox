import { mergeDupeFileSet } from "@assetbox/tools";
import { initTRPC } from "@trpc/server";
import { rename, unlink } from "fs/promises";
import { z } from "zod";

export const t = initTRPC.create();

export const appRouter = t.router({
  deleteAsset: t.procedure.input(z.string()).mutation(async (req) => {
    try {
      await unlink(req.input);
    } catch {
      throw new Error("File deletion error");
    }
    return true;
  }),

  renameAsset: t.procedure
    .input(
      z.object({
        oldPath: z.string(),
        newPath: z.string(),
      })
    )
    .mutation(async (req) => {
      try {
        await rename(req.input.oldPath, req.input.newPath);
      } catch (e) {
        throw new Error("File rename error");
      }
      return true;
    }),

  mergeAsset: t.procedure
    .input(
      z.object({
        fileSet: z.array(z.string()),
        newPathAndName: z.string(),
      })
    )
    .mutation(async (req) => {
      try {
        const result = mergeDupeFileSet(
          req.input.fileSet,
          req.input.newPathAndName
        );
      } catch (e) {
        throw new Error("File merge error");
      }
      return true;
    }),
});
