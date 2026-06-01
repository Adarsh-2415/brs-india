import type { Metadata } from "next";
import MembershipRulesClient from "./MembershipRulesClient";

export const metadata: Metadata = {
  title: "Membership Rules & Guidelines | Battery Research Society of India",
  description: "Read BRS India's regulatory framework, constitution by-laws, and terms governing the admission, conduct, and rights of the society members.",
};

export default function Page() {
  return <MembershipRulesClient />;
}
