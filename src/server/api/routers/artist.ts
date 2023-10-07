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

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis"; // see below for cloudflare and fastly adapters
import { TRPCError } from "@trpc/server";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const artistRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const currentUserId = ctx.currentUser?.toString();
    const arists = await ctx.db.artist.findMany({
      take: 100,
      where: {
        UserArtists: {
          some: {
            userId: currentUserId,
          },
        },
      },
      orderBy: [{ name: "asc" }],
    });
    return arists;
  }),
  create: privateProcedure
    .input(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          image: z.string().url(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const currentUserId = ctx.currentUser?.toString();

      const { success } = await ratelimit.limit(currentUserId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const artist = await ctx.db.artist.createMany({
        data: input,
        skipDuplicates: true,
      });

      const createManyData: {
        userId: string;
        artistId: string;
      }[] = input.map((i) => ({userId: currentUserId, artistId: i.id}))

      await ctx.db.userArtists.createMany({
        data: createManyData,
        skipDuplicates: true,
      });
      return artist;
    }),
});
