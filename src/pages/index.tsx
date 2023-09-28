import Head from "next/head";
import Link from "next/link";
import { AuthorizationCodeWithPKCEStrategy, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { SignIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { env } from "~/env.mjs";

import { api } from "~/utils/api";
import { Sign } from "crypto";

async function SignInSpotifyAuth() {
  const spot = SpotifyApi.withUserAuthorization(
    env.NEXT_PUBLIC_VITE_SPOTIFY_CLIENT_ID, "http://localhost:3000/",
    ['user-library-read', 'user-read-email', 'user-follow-read',
      'user-top-read']
  );
  if (typeof window !== 'undefined') {
    const top_artists = await spot.currentUser.topItems('artists', "long_term", 30);
    const followed_artists = await spot.currentUser.followedArtists();
    console.log(top_artists);
    console.log(followed_artists);
  }

}


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

  void SignInSpotifyAuth()

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
        <div className="w-full xl:max-w-7xl md:max-w-2xl sm:max-w-lg border-x border-slate-400">
          <div className="border-b border-slate-400 p-4 flex">
            {!user.isSignedIn && (<div className="flex justify-center">
              <SignInButton />
            </div>
            )}
            {!!user.isSignedIn && <WelcomeWagon />}
          </div>
          <div className="flex flex-wrap gap-4 justify-evenly">
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
