// components/EditButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function EditButton({
  profile,
}: Readonly<{ profile: unknown }>) {
  const router = useRouter();

  const handleEdit = () => {
    const profileData = encodeURIComponent(JSON.stringify(profile));
    router.push(`/profile/edit?profile=${profileData}`);
  };
  return (
    <Button className="mt-4" onClick={handleEdit}>
      Edit Profile
    </Button>
  );
}
