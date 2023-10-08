import Head from "next/head";
import { SpotifyApi, type Page, type Artist } from "@spotify/web-api-ts-sdk";
import { SignInButton, useUser } from "@clerk/nextjs";
import { env } from "~/env.mjs";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from "~/components/loading";
import { useState, useEffect } from "react";

dayjs.extend(relativeTime);

function GetTopArtists() {
  const [results, setResults] = useState<Page<Artist>>({} as Page<Artist>);

  useEffect(() => {
    let isMounted = true; // Add a flag to check if the component is still mounted
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
    async function fetchTopArtists() {
      if (isMounted) {
        await spot.authenticate();
        const newResults = await spot.currentUser.topItems(
          "artists",
          "long_term",
          30,
        );
        setResults(newResults);
      }
    }

    void fetchTopArtists();
    return () => {
      isMounted = false; // Set the flag to false when the component unmounts
    };
  }, []); // Empty dependency array ensures this effect only runs once

  const artistsToAdd: {
    id: string;
    name: string;
    image: string;
  }[] =
    results.items?.map((artist) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images[0]?.url ?? "",
    })) || [];

  return artistsToAdd;
}

const WelcomeWagon = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  const artistsToAdd = GetTopArtists();

  if (!user) return <div>Loading Spotify authentication...</div>;

  const { mutate, isLoading: isPopulating } = api.artist.create.useMutation({
    onSuccess: () => {
      void ctx.artist.getAll.invalidate();
    },
  });

  return (
    <div className="flex grow items-center gap-4 text-xl">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        className="rounded-lg"
        width={56}
        height={56}
        priority={false}
      />
      <p>Welcome {user.fullName}</p>
      <div className=" flex grow place-content-end justify-items-end ">
        <button
          className="flex justify-items-end gap-4 border"
          onClick={() => mutate(artistsToAdd)}
          disabled={isPopulating}
        >
          Update Artists
        </button>
      </div>
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

  const { isSignedIn } = useUser();

  if (!isSignedIn) return <div>Please Sign In!</div>

  if (artistLoading) return <LoadingPage />;

  if (!data) return <div>Something went wrong</div>;

  return (
    <div>
      <div className="flex flex-wrap justify-evenly gap-4">
        {data.map((fullArtist) => (
          <ArtistView {...fullArtist} key={fullArtist.id} />
        ))}
      </div>
    </div>
  );
};

export default function Home() {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.artist.getAll.useQuery();

  // Return empty div if user isn't loaded yet
  if (!userLoaded) {
    return <div />;
  }

  return (
    <>
      <Head>
        <title>Spot the Vinyl</title>
        <meta name="description" content="Spot the Vinyl" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="border- w-full border-x border-slate-400 sm:max-w-lg md:max-w-2xl xl:max-w-7xl">
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
