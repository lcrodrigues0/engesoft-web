import { ArticlesPageClient } from "@/components/articles/articles-page-client";
import { ENGESOFT_ROLES_COOKIE } from "@/lib/auth-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ArticlesPage() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ENGESOFT_ROLES_COOKIE)?.value;

  if (raw === undefined) {
    redirect("/login");
  }

  return <ArticlesPageClient />;
}
