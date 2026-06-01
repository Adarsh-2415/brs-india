import type { Metadata } from "next";
import ConferencesClient from "./ConferencesClient";

export const metadata: Metadata = {
  title: "Conferences & Seminars | Battery Research Society of India",
  description: "Explore national and international platforms showcasing breakthroughs in battery research, electrochemical energy storage, and sustainable green technology organized by BRS India.",
};

export default function Page() {
  return <ConferencesClient />;
}
