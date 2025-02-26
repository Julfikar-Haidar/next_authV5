import { auth } from "@/auth";
import EditButton from "@/components/EditButton";

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
    <div className="my-5 p-4 border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold">Profile</h2>
      <pre className="bg-gray-100 p-3 rounded-md mt-2">
        {JSON.stringify(profile, null, 2)}
      </pre>
      <EditButton profile={profile} />
    </div>
  );
}
