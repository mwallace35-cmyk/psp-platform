import { redirect } from "next/navigation";

/** Root /teams → /schools (the real directory) */
export default function TeamsRedirect() {
  redirect("/schools");
}
