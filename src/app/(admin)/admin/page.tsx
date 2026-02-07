import { getAdminDashboardStats } from "@/lib/actions/admin.actions";
import AdminDashboardClient from "./AdminDashboardClient";

// Force dynamic rendering since we are fetching fresh data
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const data = await getAdminDashboardStats();

    return <AdminDashboardClient data={data} />;
}
