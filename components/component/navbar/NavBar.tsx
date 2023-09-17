"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 right-0 bg-slate-600 text-white p-4 z-50 w-full">
      {" "}
      {/* Added w-full */}
      <div className="container mx-auto flex justify-between items-center">
        {/* Greeting and session information */}
        <div>
          {session ? `Hello, ${session?.user?.name}!` : "Hello, Guest!"}
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>Home</NavigationMenuItem>
            <NavigationMenuItem>About</NavigationMenuItem>
            {session ? (
              <NavigationMenuItem
                onClick={() => signOut()}
                className="hover:underline cursor-pointer"
              >
                Logout
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem
                onClick={() => signIn()}
                className="hover:underline cursor-pointer"
              >
                Login
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
