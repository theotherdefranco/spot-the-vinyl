import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const artists = await db.query.artists.findMany();

  console.log(artists);

  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {artists.map((artist) => (
          <div key={artist.id}>{artist.name}</div>
        ))}
      </div>
    </main>
  );
}
