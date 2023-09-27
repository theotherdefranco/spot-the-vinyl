import Head from "next/head";
import Link from "next/link";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";

import { api } from "~/utils/api";
import { Sign } from "crypto";

const WelcomeWagon = () => {

  const { user } = useUser();

  if (!user) return null;

  return (<div className="flex items-center text-xl gap-4">
    <img src={user.imageUrl} alt='Profile image' className="rounded-lg" />
    <p>Welcome {user.fullName}</p>

  </div>
  );
}

export default function Home() {

  const user = useUser();
  //add user into DB

  const { data, isLoading } = api.artist.getAll.useQuery();

  if (isLoading) return <div className="flex justify-left">Loading...</div>

  if (!data) return <div className="flex justify-left">Something went wrong!</div>

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
            {!!user.isSignedIn && <WelcomeWagon />}
          </div>
          <div className="grid grid-flow-col col-auto auto-cols-max">
            {[...data]?.map((artist) => (
              <div key={artist.id} className="p-8 text-center text-slate-200">
                <img src={artist.image} alt='Artist Image' className="h-32 w-32 rounded-full" /> {artist.name}
              </div>))}
          </div>
        </div>
      </main>
    </>
  );
}
