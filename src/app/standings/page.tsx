import { redirect } from "next/navigation";

/** Root /standings → /football/standings */
export default function StandingsRedirect() {
  redirect("/football/standings");
}
