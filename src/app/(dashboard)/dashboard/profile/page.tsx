import { getCurrentUser } from "@/lib/actions/user.actions";
import { ProfileForm } from "./profile-form";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return <ProfileForm user={user} />;
}
