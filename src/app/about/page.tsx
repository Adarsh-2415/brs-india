import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us | Battery Research Society of India",
  description: "Learn about the Battery Research Society of India (BRS India) — our mission, objectives, pioneering research, skill development programs, and partnership networks in battery science.",
};

export default function Page() {
  return <AboutClient />;
}
