import { getVerificationQueue } from "@/lib/actions/admin.actions";
import { VerificationQueue } from "./verification-queue";

export default async function VerificationQueuePage() {
    const queue = await getVerificationQueue();

    return <VerificationQueue queue={queue} />;
}
