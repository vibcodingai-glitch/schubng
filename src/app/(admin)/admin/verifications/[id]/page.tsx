import { getVerificationRequestById } from "@/lib/actions/admin.actions";
import { VerificationDetail } from "./verification-detail";
import { notFound } from "next/navigation";

export default async function VerificationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const request = await getVerificationRequestById(id);

    if (!request) {
        notFound();
    }

    return <VerificationDetail request={request} />;
}
