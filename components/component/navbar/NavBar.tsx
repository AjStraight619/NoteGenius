// "use client";
// import { signIn, signOut, useSession } from "next-auth/react";
// // import {
// //   NavigationMenu,
// //   NavigationMenuList,
// //   NavigationMenuItem,
// //   NavigationMenuLink,
// //   navigationMenuTriggerStyle,
// // } from "@/components/ui/navigation-menu";
// import Link from "next/link";

// export default function NavBar() {
//   const { data: session } = useSession();

//   return (
//     <nav className="fixed top-0 right-0 bg-slate-600 text-white p-4 z-50 w-full">
//       <div className="container mx-auto flex justify-between items-center">
//         {/* Greeting and session information */}
//         <div className="flex-initial text-left">
//           {session ? `Hello, ${session?.user?.name}!` : "Hello, Guest!"}
//         </div>
//         {/* Navigation Menu */}
//         <div className="flex-initial text-right">
//           <NavigationMenu>
//             <NavigationMenuList className="flex justify-end space-x-4">
//               <NavigationMenuItem className="">
//                 <Link href="/chat" legacyBehavior passHref>
//                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//                     Chat
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem>
//               <NavigationMenuItem className="">
//                 <Link href="/folders" legacyBehavior passHref>
//                   <NavigationMenuLink className={navigationMenuTriggerStyle()}>
//                     Notes
//                   </NavigationMenuLink>
//                 </Link>
//               </NavigationMenuItem>

//               {session ? (
//                 <NavigationMenuItem
//                   onClick={() => signOut()}
//                   className="hover:underline cursor-pointer"
//                 >
//                   Logout
//                 </NavigationMenuItem>
//               ) : (
//                 <NavigationMenuItem
//                   onClick={() => signIn()}
//                   className="hover:underline cursor-pointer"
//                 >
//                   Login
//                 </NavigationMenuItem>
//               )}
//             </NavigationMenuList>
//           </NavigationMenu>
//         </div>
//       </div>
//     </nav>
//   );
// }
