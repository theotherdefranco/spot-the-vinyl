import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b border-emerald-400 p-4 text-xl font-semibold">
      <div>Spotify Results</div>

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: 56,
                  height: 56,
                },
              },
            }}
          />
        </SignedIn>
      </div>
    </nav>
  );
}
