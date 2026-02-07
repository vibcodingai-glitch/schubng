import { getTransactions } from "@/lib/actions/admin.actions";
import { TransactionsClient } from "./TransactionsClient";

export const dynamic = 'force-dynamic';

export default async function TransactionsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const page = Number(resolvedSearchParams.page) || 1;
    const data = await getTransactions(page, 20);

    return <TransactionsClient data={data} currentPage={page} />;
}
