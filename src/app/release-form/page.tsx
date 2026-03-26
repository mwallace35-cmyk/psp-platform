import type { Metadata } from "next";
import ReleaseFormClient from "./ReleaseFormClient";

export const metadata: Metadata = {
  title: "Photo & Media Release Form | PhillySportsPack",
  description: "Photo and media release consent form for student athletes and adults participating in Philadelphia-area high school athletic events.",
};

export default function ReleaseFormPage() {
  return <ReleaseFormClient />;
}
