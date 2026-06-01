import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Battery Research Society of India",
  description: "Get in touch with BRS India. Reach out for research collaborations, membership inquiries, technical guidance, or visit our office at IIT Roorkee.",
};

export default function Page() {
  return <ContactClient />;
}
