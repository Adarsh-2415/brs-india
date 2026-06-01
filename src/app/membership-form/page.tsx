import type { Metadata } from "next";
import MembershipFormClient from "./MembershipFormClient";

export const metadata: Metadata = {
  title: "Apply for Membership | Battery Research Society of India",
  description: "Start your application for the Battery Research Society of India (BRS India). Apply online for Student, Professional, or Organizational memberships.",
};

export default function Page() {
  return <MembershipFormClient />;
}
