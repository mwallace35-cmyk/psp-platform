import { redirect } from "next/navigation";

/** /pros → /our-guys (consolidated alumni tracking) */
export default function ProsRedirect() {
  redirect("/our-guys");
}
