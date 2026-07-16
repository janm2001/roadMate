import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { AppHeader } from "@/components/app-header";
import { AppFooter } from "@/components/app-footer";
import { SignOutButton } from "@/features/auth/components/sign-out-button";
import { getAuthenticatedUser } from "@/features/auth/queries/get-authenticated-user";
import { TripDetail } from "@/features/trips/components/trip-detail";
import { getTripPlan } from "@/features/trips/queries/get-trip-plans";

type TemplatePageProps = {
  params: Promise<{ templateId: string }>;
};

export default async function TemplatePage({ params }: TemplatePageProps) {
  const { templateId } = await params;
  const [user, template] = await Promise.all([
    getAuthenticatedUser(),
    getTripPlan(templateId),
  ]);

  if (!user) {
    redirect("/login");
  }

  if (!template) {
    notFound();
  }

  return (
    <main className="min-h-svh bg-[#f7f8f4]">
      <AppHeader accountLabel={user.email} action={<SignOutButton />} />
      <TripDetail tripPlan={template} />
      <AppFooter />
      <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          href={`/trips/new?template=${template.id}`}
          className="inline-flex h-11 items-center rounded-md bg-foreground px-4 text-sm font-semibold text-background shadow-lg"
        >
          Use this template
        </Link>
      </div>
    </main>
  );
}
