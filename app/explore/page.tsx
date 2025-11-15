import { ExploreView } from "@/components/explore/explore-view";
import { fetchExploreData } from "@/lib/supabase/queries";

export const revalidate = 0;

export default async function ExplorePage() {
  const data = await fetchExploreData();

  return (
    <ExploreView
      courts={data.courts}
      threads={data.threads}
      totalReplies={data.totalReplies}
    />
  );
}
