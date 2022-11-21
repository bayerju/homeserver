import { TRPCError } from "@trpc/server";
import { resolve } from "path";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
    getSession: publicProcedure
        .query(async ({ ctx }) => {
            return ctx.session;
        }),
});