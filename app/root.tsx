import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation
} from "react-router";
import type { LinksFunction } from "react-router";

import stylesheet from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "preload", href: stylesheet, as: "style" },
  { rel: "stylesheet", href: stylesheet },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <>
      {/* Global Dead-Click Loading Bar */}
      <div 
        className={`fixed top-0 left-0 h-1 bg-[#2D3191] z-[9999] transition-all ease-out ${
          isNavigating ? 'w-2/3 duration-[2000ms] opacity-100' : 'w-full duration-300 opacity-0'
        }`} 
      />
      
      <Outlet />
    </>
  );
}
