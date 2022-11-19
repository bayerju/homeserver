import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const sgjRouter = router({
    notifications: publicProcedure
        .input(z.object({ text: z.string().nullish() }).nullish())
        .query(({ input }) => {
            return {
                greeting: `Hello ${input?.text ?? "world"}`,
            };
        }),
    getAll: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.example.findMany();
    }),
});
