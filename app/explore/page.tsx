import { ExploreView } from "@/components/explore/explore-view";

export default async function ExplorePage() {
  const data = await ();

  return (
    <ExploreView
      courts={data.courts}
      threads={data.threads}
      totalReplies={data.totalReplies}
    />
  );
}
