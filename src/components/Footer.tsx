"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.06] bg-brs-900 pt-20 pb-12 sm:pt-24 sm:pb-16"
      style={{ paddingTop: '80px' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-brs-400/20">
                <Image
                  src="/logo_high_res_v4.png"
                  alt="BRS India logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold text-brs-100">
                  BRS India
                </div>
                <div className="text-[11px] text-brs-400/60">
                  Battery Research Society
                </div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-brs-400/60">
              Advancing battery science and electrochemical energy research
              through collaboration and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brs-400/50">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2.5">
              {["About Us", "Council", "Lectures", "Membership"].map((link) => (
                <li key={link}>
                  <Link
                    href={
                      link === "About Us" ? "/about" :
                        link === "Council" ? "/#council" :
                          link === "Membership" ? "/membership-form" :
                            `/${link.toLowerCase()}`
                    }
                    className="text-sm text-brs-400/70 transition-colors duration-200 hover:text-brs-100"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brs-400/50">
              Address
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-brs-400/70">
              Room No: 318, Level 2,<br />
              Department of Physics,<br />
              IIT Roorkee-247667, Haridwar,<br />
              Uttarakhand, India.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brs-400/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brs-400/40" />
                <span className="text-sm text-brs-400/70">
                  brsoffice.india@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brs-400/40" />
                <span className="text-sm text-brs-400/70">
                  IIT Roorkee, India
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brs-400/40" />
                <span className="text-sm text-brs-400/70">
                  +91-1332-284861
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-8 border-t border-white/[0.06] py-8 text-center"
          style={{ paddingBottom: '60px' }}
        >
          <p className="text-sm font-medium tracking-wide text-brs-100/60 hover:text-white transition-colors duration-300">
            © 2026 Battery Research Society of India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
