import { auth } from "@/auth";

const API_URL = process.env.NEXT_PUBLIC_GATEWAY_API_URL;
if (!API_URL) {
  throw new Error(
    "API URL is missing. Please check your environment variables."
  );
}

const getProfile = async (accessToken: string) => {
  console.log("Fetching profile from:", API_URL); // Debugging

  const res = await fetch(API_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("Failed to fetch profile:", res.status);
    return null;
  }

  return res.json();
};

export default async function ProfilePage() {
  const session = await auth();
  const accessToken = session?.user?.data?.accessToken;

  if (!accessToken) {
    return <div>Unauthorized. Please log in.</div>;
  }

  console.log("Access Token:", accessToken); // Debugging

  const profile = await getProfile(accessToken);

  return (
    <div className="my-5">Profile: {JSON.stringify(profile, null, 2)}</div>
  );
}
