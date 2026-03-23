import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProgressClient from "@/components/progress/ProgressClient";

export default async function Progress() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return <ProgressClient user={session.user} />;
}
