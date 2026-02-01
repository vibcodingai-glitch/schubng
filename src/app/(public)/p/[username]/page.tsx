import { Metadata } from "next";
import PublicProfileClient from "@/components/profile/PublicProfileClient";
import { getPublicUserProfile } from "@/lib/actions/user.actions";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const profile = await getPublicUserProfile(params.username);

  if (!profile) {
    return {
      title: "Profile Not Found | SupplyChain Hub",
    };
  }

  return {
    title: `${profile.fullName} | SupplyChain Hub`,
    description: profile.about.substring(0, 160),
    openGraph: {
      title: `${profile.fullName} | SupplyChain Hub`,
      description: profile.headline,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const profile = await getPublicUserProfile(params.username);

  if (!profile) {
    notFound();
  }

  return <PublicProfileClient profile={profile} />;
}
