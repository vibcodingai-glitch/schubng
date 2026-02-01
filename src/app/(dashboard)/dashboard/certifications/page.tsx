import { getCertifications } from "@/lib/actions/certification.actions";
import { CertificationsList } from "./certifications-list";

export default async function CertificationsPage() {
    const certifications = await getCertifications();

    return <CertificationsList certifications={certifications} />;
}
