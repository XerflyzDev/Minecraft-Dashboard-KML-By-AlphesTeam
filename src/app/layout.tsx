import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { AuthSessionProvider } from "@/components/auth-session-provider";
import { authOptions } from "@/lib/auth-options";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minecraft Server Dashboard",
  description:
    "Realtime Minecraft Java server dashboard for world time, weather, players, biome, and coordinates.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
