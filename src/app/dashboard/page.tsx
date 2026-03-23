import DashboardClient from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  // For demo purposes, allow direct access without auth
  // In production, you'd check session here
  
  return <DashboardClient user={{ id: 'demo-user', name: 'Demo User', email: 'demo@example.com' }} />;
}
