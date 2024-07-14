import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import Link from "next/link";

import { db } from "~/server/db";
import SpotAuth from "./_components/SpotAuth";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const artists = await db.query.artists.findMany({
    orderBy: (model, { asc }) => asc(model.name),
  });

  async function Images() {
    return (
      <div className=" flex h-20 flex-wrap justify-center gap-4">
        {[...artists, ...artists].map((artist) => (
          <div key={artist.id} className="p-4 text-center text-slate-200">
            <img
              src={artist.image}
              className="h-40 w-40 rounded-full"
              width={512}
              height={512}
            />
            <div className="text-center ">{artist.name}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <main className="flex h-screen justify-center">
      <SignedOut>
        <div className="h-full w-full p-2 text-center text-2xl">
          Please Sign In
        </div>
      </SignedOut>
      <SignedIn>
        <SpotAuth />
        <Images />
      </SignedIn>
    </main>
  );
}
