import { getVerificationRequest } from "@/lib/actions/admin.actions";
import { VerificationDetail } from "./verification-detail";
import { notFound } from "next/navigation";

export default async function VerificationDetailPage({ params }: { params: { id: string } }) {
    const request = await getVerificationRequest(params.id);

    if (!request) {
        notFound();
    }

    return <VerificationDetail request={request} />;
}
