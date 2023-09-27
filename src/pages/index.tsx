import Head from "next/head";
import Link from "next/link";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { Sign } from "crypto";

export default function Home() {

  const user = useUser();

  const { data, isLoading } = api.artist.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>

  if (!data) return <div>Something went wrong!</div>

  return (
    <>
      <Head>
        <title>Spot the Vinyl</title>
        <meta name="description" content="Spot the Vinyl" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full xl:max-w-7xl md:max-w-2xl border-x border-slate-400">
          <div className="border-b border-slate-400 p-4 flex">
            {!user.isSignedIn && (<div className="flex justify-center">
              <SignInButton />
            </div>
            )}
            {!!user.isSignedIn && <SignOutButton />}
          </div>
          <div className="flex flex-col">
            {[...data]?.map((artist) => (
              <div key={artist.id} className="p-8 border-b border-slate-400">{artist.name}</div>))}
          </div>
        </div>
      </main>
    </>
  );
}
