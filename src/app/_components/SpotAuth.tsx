"use client";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";

const spotifyTokenStorageID =
  "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token";

let redirect = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  redirect = "http://localhost:3000/";
} else {
  redirect = "https://spot-the-vinyl.vercel.app/";
}
const clientId = process.env.NEXT_PUBLIC_VITE_SPOTIFY_CLIENT_ID;
console.log(clientId);
const api = SpotifyApi.withUserAuthorization(clientId!, redirect, [
  "user-library-read",
  "user-read-email",
  "user-follow-read",
  "user-top-read",
]);

const spotAuth = async () => {
  await api.authenticate();
};

export default function SpotAuth() {
  return <button onClick={spotAuth}>Click me</button>;
}
