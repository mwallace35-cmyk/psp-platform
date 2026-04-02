import { redirect } from "next/navigation";

/** /philly-everywhere → /our-guys (consolidated alumni tracking) */
export default function PhillyEverywhereRedirect() {
  redirect("/our-guys");
}
