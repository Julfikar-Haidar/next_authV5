"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession from next-auth
import { handleUpdateProfile } from "@/app/actions/authActions";
import { toast, Toaster } from "sonner";

interface Profile {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  // Check if the session is loaded and the user is authenticated
  useEffect(() => {
    if (status === "loading") return; // Wait for session loading to finish

    if (!session?.user) {
      // If session is not available, handle it (e.g., redirect to login)
      router.push("/login");
    }

    // Get profile data from URL query
    const profileData = new URLSearchParams(window.location.search).get(
      "profile"
    );

    if (profileData) {
      try {
        const parsedProfile = JSON.parse(decodeURIComponent(profileData));
        const profileFromData = parsedProfile.data; // Access the nested `data` property
        setProfile(profileFromData);
        setFirstName(profileFromData.firstName || "");
        setLastName(profileFromData.lastName || "");
      } catch (error) {
        console.error("Error parsing profile data:", error);
      }
    }
  }, [session, status, router]);

  // Handle form submission to update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profile || !session?.user?.data?.accessToken) return;

    const updatedProfile = { ...profile, firstName, lastName };

    // Get the accessToken from session
    const accessToken = session.user.data.accessToken;
    const appUrl = process.env.NEXT_PUBLIC_PROFILE_EDIT;
    if (!appUrl) {
      console.error("Profile edit URL is not defined");
      return;
    }

    const res = await handleUpdateProfile({
      accessToken,
      firstName: updatedProfile.firstName,
      lastName: updatedProfile.lastName,
    });

    if (res.message) {
      toast.success("Success", {
        description: res?.message,
      });
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } else {
      console.error("Failed to update profile");
    }
  };

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="my-5 p-4 border rounded-lg shadow-md">
      <Toaster />
      <h2 className="text-xl font-semibold">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mt-4">
          <label htmlFor="firstName" className="block text-sm">
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="lastName" className="block text-sm">
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 p-2 border rounded"
          />
        </div>

        <Button type="submit" className="mt-4">
          Update Profile
        </Button>
      </form>
    </div>
  );
}
