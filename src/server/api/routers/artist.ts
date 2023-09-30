import { clerkClient, useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/dist/types/server";
import { z } from "zod";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.imageUrl,
  };
};

export const artistRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.currentUser?.toString()
    const arists = await ctx.db.artist.findMany({
      take: 100,
      where: {
        UserArtists: {
          some: {
            userId: currentUserId,
          },
        },
      },
    });
    return arists;
  }),
  create: privateProcedure
    .input(
        z.object({
            content: z.string().min(1).max(280),
        })
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.toString()

      const artist = await ctx.db.artist.createMany({
        data: [
          {
            id: "3aQeKQSyrW4qWr35idm0cy",
            name: "T-Pain",
            image:
              "https://i.scdn.co/image/ab6761610000e5ebe9dd7dc12046ef96343a9b7c",
          },
        ],
        skipDuplicates: true,
      });

      await ctx.db.userArtists.createMany({
        data: {
          userId: userId,
          artistId: "3aQeKQSyrW4qWr35idm0cy",
        },
        skipDuplicates: true,
      });
      return artist;
    }),
});
