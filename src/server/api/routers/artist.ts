import { clerkClient, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {

    return {
        id: user.id,
        username: user.username,
        profileImageUrl: user.imageUrl
    };
};

export const artistRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const arists = await ctx.db.artist.findMany({
            take: 100,
            where: {
                UserArtists: {
                    some: {
                        userId: 'user_2VlBi7FNHK4fnFwrQOItPuxJduh'
                    }
                }
            },
        });
        return arists;
    }),
});
