"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function handleCredentialsSignin({
  email_or_phone,
  password,
}: {
  email_or_phone: string;
  password: string;
}) {
  try {
    await signIn("credentials", { email_or_phone, password, redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            message: "Invalid credentials",
          };
        default:
          return {
            message: "Something went wrong.",
          };
      }
    }
    throw error;
  }
}

export async function handleGithubSignin() {
  await signIn("github", { redirectTo: "/" });
}

export async function handleSignOut() {
  await signOut();
}

export async function handleUpdateProfile({
  accessToken,
  firstName,
  lastName,
}: {
  accessToken: string;

  firstName: string;
  lastName: string;
}) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_PROFILE_EDIT;
    if (!appUrl) {
      return { message: "Profile edit URL is not defined" };
    }

    if (!accessToken) {
      return { message: "Access token is missing" };
    }

    const res = await fetch(appUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    if (!res.ok) {
      return { message: "Failed to update profile" };
    }

    return { message: "Profile updated successfully" };
  } catch (error) {
    console.error(error);
    return { message: "An unexpected error occurred." };
  }
}
