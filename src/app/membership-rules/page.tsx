"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Gavel, 
  Scale, 
  UserPlus, 
  Map, 
  FileText,
  AlertCircle,
  Award
} from "lucide-react";
import Footer from "@/components/Footer";

const RULE_SECTIONS = [
  {
    id: "admission",
    icon: UserPlus,
    title: "Admission of Membership",
    items: [
      "The admission of a person as a member of the Society shall be decided by its Executive Council from time to time.",
      "An individual willing to be a member of the Society has to apply in prescribed form, along with supporting documents to the Executive council of the Society duly filled in and signed and recommended by a founder member of the society. The work (research/academic/developmental/managerial) of the applicant has to be related to battery research, development and outreach; and in line with the major objectives of the society.",
      "The Secretary of the Society shall examine the application in consultation with the General Secretary and place the same before the Executive council for a decision.",
      "The Executive council may accept or reject the application and the decision of the Executive council in this regard shall be final. It shall not be bound to assign any reason for its rejection of membership.",
      "The approval of the Executive council shall be intimated to the member, his name shall be entered in the register of members, to be maintained in such manner & form as prescribed under the Uttarakhand Societies Registration and Regulation Rules, 2012 and he/she may be issued an Identity Card of the society."
    ]
  },
  {
    id: "jurisdiction",
    icon: Map,
    title: "Jurisdiction of Society",
    items: [
      "The Jurisdiction of Society will be in the whole of India."
    ]
  },
  {
    id: "eligibility",
    icon: ShieldCheck,
    title: "Eligibility and Qualifications",
    items: [
      "Any person who has attained 18 years of age and who agreeing to abide by the rules and regulations of the Society can become the member of the Society by making written application to the Society in the prescribed manner. However, the admittance to membership will be finally decided by membership committee appointed by Executive council.",
      "A Member shall continue to remain the member as long as the membership fee is being paid as per the rules of the society. A Member who has paid the membership fee once shall not pay the fee repeatedly except the annual subscription fee, which shall be decided by the Executive council time to time. The membership shall terminate if he/she fails to renew his/her membership before the end of the financial year or in case of resignation, indiscipline, death, madness, bankruptcy, involved in moral turpitude etc. as decided and determined by the Executive council."
    ]
  },
  {
    id: "cessation",
    icon: AlertCircle,
    title: "Cessation of Membership",
    description: "Any person admitted as a member shall cease to be a member of the Society in the following events:",
    items: [
      "Upon his/her acting contrary to the aims and objectives of the Society.",
      "Upon such member being found guilty of a financial misappropriation of the funds of the society.",
      "Upon indictment and directions for removal by the District Registrar/ Registrar/ Registrar General of Societies.",
      "An Honorary member shall cease to be a member of the Society, if the Executive council, decides so by passing a resolution in this behalf."
    ]
  },
  {
    id: "rights",
    icon: Scale,
    title: "Rights and Duties of Members",
    items: [
      "All the members of the Society shall be bound by the rules and regulations of the Society as contained in its by-laws and amended from time to time.",
      "Founder member of the Society shall have right to contest election in the Society to become Executive council Members of Society and cast his/her vote at the elections of the Society provided such member is not a defaulter in payment of any dues of the Society and the annual subscription for a period of three months beyond the due date.",
      "Founder member of the Society shall have the right to inspect the books containing the minutes of proceedings of the general meetings, meetings of the Executive council and register of members of the society on any working day by giving a notice of seven days before the date of inspection.",
      "Every member shall inform the Society about any change in his correspondence address, Mobile Number, email address which shall be duly recorded in the register of members of the Society and upon which the Society may issue a fresh Identity Card to such member.",
      "The Executive council Members are authorized to issue Legal Notices, Lodge FIR, Court Cases against any person whether it is a Body Corporate, Partnership or Proprietorship Firm or any other association as per the law of land against any malpractice, illegal act for and on behalf of the society subject to written approval of President.",
      "The election of Executive council members shall be made only by the founder members through voting either by show of hands or poll. No other Members of the Foundation shall be eligible to contest the executive council election or vote therein unless he gets designated as founder members of the Society."
    ]
  }
];

export default function MembershipRulesPage() {
  return (
    <div className="bg-[#F8FAFC]">
      {/* ─── Hero Section ─── */}
      <section className="relative pt-32 pb-20 bg-brs-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#8EB69B 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-brs-400 border border-white/10">
              <Gavel className="h-3 w-3" />
              Society Constitution
            </span>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-6xl uppercase">
              Membership <span className="text-brs-400">Rules</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-lg text-brs-100/70 font-medium">
              The regulatory framework governing the admission, conduct, and rights of the Battery Research Society of India members.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Rules Content ─── */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {RULE_SECTIONS.map((section, sIdx) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: sIdx * 0.1 }}
                className="relative group"
              >
                {/* Section Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-2xl bg-brs-900 flex items-center justify-center text-brs-400 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brs-900 uppercase tracking-tight">
                      {section.title}
                    </h2>
                    <div className="h-1 w-12 bg-brs-600 mt-1 rounded-full" />
                  </div>
                </div>

                {/* Rules List */}
                <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm p-8 sm:p-10">
                  {section.description && (
                    <p className="mb-6 text-slate-500 font-bold italic border-l-4 border-brs-600 pl-4 bg-slate-50 py-3 rounded-r-xl">
                      {section.description}
                    </p>
                  )}
                  
                  <div className="space-y-6">
                    {section.items.map((item, iIdx) => (
                      <motion.div
                        key={iIdx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: iIdx * 0.05 }}
                        className="flex items-start gap-4 group/item"
                      >
                        <div className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[10px] font-black text-brs-900 border border-slate-100 group-hover/item:bg-brs-900 group-hover/item:text-white transition-colors">
                          {String.fromCharCode(97 + iIdx)}.
                        </div>
                        <p className="text-[15px] leading-relaxed text-slate-600 font-medium group-hover/item:text-brs-900 transition-colors">
                          {item}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Aesthetic Ornament */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 h-32 w-1 bg-brs-600/10 rounded-full hidden lg:block" />
              </motion.div>
            ))}
          </div>

          {/* Bottom Compliance Notice */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-20 p-8 rounded-[2rem] bg-brs-900 text-center text-white overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Scale className="h-24 w-24" />
            </div>
            <h3 className="text-xl font-bold mb-4 flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-brs-400" />
              Compliance Statement
            </h3>
            <p className="text-sm text-brs-100/60 max-w-2xl mx-auto leading-relaxed">
              Membership in the Battery Research Society of India implies full acceptance of these rules and any subsequent amendments passed by the Executive Council. All members are expected to maintain the highest standards of professional and ethical conduct.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
