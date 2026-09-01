import UserComponent from "@/components/user-component";
import { getAuthUser } from "@/lib/auth/server";

export default async function BrowsePage() {
  const user = await getAuthUser();

  return <UserComponent user={user} />;
}