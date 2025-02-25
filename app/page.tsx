"use client";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return <div>Please log in to see your profile.</div>;
  }

  const userProfile = session?.user;
  console.log("userprofile", userProfile?.data?.user?.firstName);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="max-w-sm min-h-[400px] flex flex-col">
        <CardHeader>
          <Image
            className="rounded-lg w-full h-[200px] object-cover  px-2"
            src="https://images.pexels.com/photos/11350470/pexels-photo-11350470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt="img"
            width={500}
            height={500}
            priority
          />
        </CardHeader>
        <CardContent>
          <CardTitle className="mb-2 text-2xl font-bold">
            Welcome,{" "}
            <span className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text">
              {userProfile?.data?.user?.firstName || "User"}{" "}
              {userProfile?.data?.user?.lastName || "Guest"}
            </span>{" "}
            !
          </CardTitle>

          <p className="text-muted-foreground">
            This project demonstrates authentication using{" "}
            <strong>NextAuth.js</strong>, a robust and flexible authentication
            solution for Next.js applications. It provides built-in support for
            OAuth providers, credentials authentication, and session management,
            making secure user authentication seamless and efficient.
          </p>

          <p className="text-muted-foreground mt-2">
            The code is open-source and can be customized to fit various
            authentication needs. Explore the implementation and learn how to
            integrate <strong>NextAuth.js</strong> in your own projects!
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
