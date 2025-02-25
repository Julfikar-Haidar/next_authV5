import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInSchema } from "./lib/zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Credentials Provider for email/phone login
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email_or_phone: {
          label: "Please enter your phone number or Email",
          type: "text",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          throw new Error("Invalid credentials format");
        }
        console.log(credentials);
        try {
          const API_URL = `${process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_API_URL}`;
          const res = await fetch(API_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const user = await res.json();

          if (!res.ok) {
            throw new Error(user?.message || "Login failed");
          }

          return user;
        } catch (error) {
          console.error("Auth Error:", error);
          return null;
        }
      },
    }),

    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  pages: {
    signIn: "/auth/signin",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Normal credentials login
      if (user) {
        return {
          ...token,
          ...user,
        };
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user = {
          id: token.id,
          role: token.role,
          ...token,
        };
        session.access_token = token.access_token;
      }
      return session;
    },

    authorized({ request: { nextUrl }, auth }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const role = auth?.user?.role || "user";

      if (pathname.startsWith("/auth/signin") && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      if (pathname.startsWith("/admin") && role !== "admin") {
        return Response.redirect(new URL("/", nextUrl));
      }
      return !!auth;
    },
  },
});
