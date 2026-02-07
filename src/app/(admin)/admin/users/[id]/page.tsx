import { getUserById } from "@/lib/actions/admin.actions";
import { AdminUserDetail } from "./AdminUserDetail";
import { notFound } from "next/navigation";

export default async function UserDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const user = await getUserById(id);

    if (!user) {
        notFound();
    }

    return <AdminUserDetail user={user} />;
}
