import Link from "next/link";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const artists = await db.query.artists.findMany({
    orderBy: (model, { asc }) => asc(model.name),
  });

  return (
    <main className="bordder-l flex h-screen justify-center border-r">
      <div className=" flex h-20 flex-wrap justify-center gap-8">
        {[...artists, ...artists].map((artist) => (
          <div key={artist.id} className="p-8 text-center text-slate-200">
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
    </main>
  );
}
