import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/login');
  }

  return <DashboardClient user={session.user} />;
}
