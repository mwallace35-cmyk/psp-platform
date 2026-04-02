import { redirect } from "next/navigation";

/** Root /stats → /football/leaderboards */
export default function StatsRedirect() {
  redirect("/football/leaderboards");
}
