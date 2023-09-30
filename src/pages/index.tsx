import Head from "next/head";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { SignInButton, useUser } from "@clerk/nextjs";
import { env } from "~/env.mjs";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";

dayjs.extend(relativeTime);

async function SignInSpotifyAuth() {
  const spot = SpotifyApi.withUserAuthorization(
    env.NEXT_PUBLIC_VITE_SPOTIFY_CLIENT_ID,
    "https://spot-the-vinyl.vercel.app",
    [
      "user-library-read",
      "user-read-email",
      "user-follow-read",
      "user-top-read",
    ],
  );
  if (typeof window !== "undefined") {
    const top_artists = await spot.currentUser.topItems(
      "artists",
      "long_term",
      30,
    );
    const followed_artists = await spot.currentUser.followedArtists();
    console.log(top_artists);
    console.log(followed_artists);
  }
}

const WelcomeWagon = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4 text-xl">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="rounded-lg"
        width={56}
        height={56}
      />
      <p>Welcome {user.fullName}</p>
    </div>
  );
};

type ArtistFromUser = RouterOutputs["artist"]["getAll"][number];

const ArtistView = (props: ArtistFromUser) => {
  const artist = props;

  return (
    <div key={artist.id} className="p-8 text-center text-slate-200">
      <Image
        src={artist.image}
        alt="Artist Image"
        className="h-40 w-40 rounded-full"
        width={512}
        height={512}
      />{" "}
      {artist.name}
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: artistLoading } = api.artist.getAll.useQuery();

  if (artistLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div>
      <div className="flex flex-wrap justify-evenly gap-4">
        {[...data]?.map((fullArtist) => (
          <ArtistView {...fullArtist} key={fullArtist.id} />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  api.artist.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) return <div />;

  void SignInSpotifyAuth();

  return (
    <>
      <Head>
        <title>Spot the Vinyl</title>
        <meta name="description" content="Spot the Vinyl" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="w-full border-x border-slate-400 sm:max-w-lg md:max-w-2xl xl:max-w-7xl">
          <div className="flex border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {!!isSignedIn && <WelcomeWagon />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
}
