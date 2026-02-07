import { getUsers } from "@/lib/actions/admin.actions";
import UsersClient from "./UsersClient";

export const dynamic = 'force-dynamic';

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const search = (resolvedSearchParams.q as string) || "";

    const data = await getUsers(page, 20, search);

    return <UsersClient data={data} currentPage={page} currentSearch={search} />;
}
