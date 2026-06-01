import type { Metadata } from "next";
import LecturesClient from "./LecturesClient";

export const metadata: Metadata = {
  title: "Lecture Series | Battery Research Society of India",
  description: "Explore our curated collection of expert presentations, scientific deep-dives, and technical seminars advancing the frontiers of battery technology in India.",
};

export default function Page() {
  return <LecturesClient />;
}
