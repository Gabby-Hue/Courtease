import { notFound } from "next/navigation";

import { ThreadDiscussion } from "@/components/forum/thread-discussion";
import { fetchForumThreadDetail } from "@/lib/supabase/queries";

export default async function ForumThreadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thread = await fetchForumThreadDetail(slug);

  if (!thread) {
    notFound();
  }

  return <ThreadDiscussion thread={thread} />;
}
