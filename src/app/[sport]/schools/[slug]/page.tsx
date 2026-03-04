import { redirect } from "next/navigation";

type PageParams = { sport: string; slug: string };

export default async function SportSchoolRedirect({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  redirect(`/schools/${slug}`);
}
