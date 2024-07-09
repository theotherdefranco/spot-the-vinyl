import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const artists = await db.query.artists.findMany({
    orderBy: (model, { asc }) => asc(model.name),
  });

  return (
    <main className="flex h-screen justify-center">
      <div className="flex flex-wrap gap-4 border-emerald-400">
        {artists.map((artist) => (
          <div key={artist.id} className="w-48 p-4">
            <img src={artist.image} className="rounded-full" />
            <div className="text-center">{artist.name}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
