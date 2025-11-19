import { createSuccessResponse, handleApiError } from "@/lib/api/utils";
import { fetchCourtSummaries } from "@/lib/supabase/queries";

export async function GET() {
  try {
    const courts = await fetchCourtSummaries();
    return createSuccessResponse(courts);
  } catch (error) {
    return handleApiError(error, "venues");
  }
}
