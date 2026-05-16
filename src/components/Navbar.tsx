"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Home",       href: "/" },
  { label: "About Us",   href: "/about" },
  { label: "Council",    href: "/#council" },
  { label: "Lectures",   href: "/lectures" },
  { 
    label: "Membership", 
    href: "/membership",
    children: [
      { label: "Membership Rules", href: "/membership-rules" },
      { label: "Membership Application Form", href: "/membership-form" },
    ]
  },
  { label: "Contact",    href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-brs-900/90 shadow-[0_4px_40px_rgba(5,31,32,0.4)] border-b border-white/[0.08]"
          : "bg-brs-900/70 border-b border-white/[0.04]"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[70px] items-center justify-between">

          {/* ─── Left: Logo + Name ─── */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-brs-400/25 transition-all duration-300 group-hover:ring-brs-400/55 group-hover:shadow-[0_0_16px_rgba(142,182,155,0.2)]">
              <Image
                src="/logo_high_res_v4.png"
                alt="Battery Research Society of India logo"
                fill
                sizes="100px"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold tracking-tight text-brs-100">
                BRS India
              </span>
              <span className="hidden sm:block text-[10.5px] text-brs-400/70 font-medium tracking-wider uppercase">
                Battery Research Society
              </span>
            </div>
          </Link>

          {/* ─── Center: Desktop Glass Pill Nav ─── */}
          <div className="hidden lg:flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.03] backdrop-blur-md px-1.5 py-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const hasChildren = !!link.children;
              
              if (hasChildren) {
                return (
                  <div key={link.label} className="relative group/dropdown">
                    <button
                      className={`
                        relative flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium
                        transition-all duration-300 ease-out
                        ${active
                          ? "bg-brs-600/35 text-white border border-brs-400/25 shadow-[0_0_14px_rgba(217,119,87,0.35)]"
                          : "text-brs-400/85 border border-transparent hover:bg-white/[0.08] hover:text-brs-100 hover:border-white/[0.1] hover:shadow-[0_0_12px_rgba(142,182,155,0.1)]"
                        }
                      `}
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-hover/dropdown:rotate-180" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-300 z-[60]">
                      <div className="w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-brs-900/95 p-1.5 shadow-2xl backdrop-blur-xl">
                        {link.children?.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-brs-400/80 transition-all duration-200 hover:bg-brs-600/20 hover:text-white"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium
                    transition-all duration-300 ease-out
                    ${active
                      ? "bg-brs-600/35 text-white border border-brs-400/25 shadow-[0_0_14px_rgba(217,119,87,0.35)]"
                      : "text-brs-400/85 border border-transparent hover:bg-white/[0.08] hover:text-brs-100 hover:border-white/[0.1] hover:shadow-[0_0_12px_rgba(142,182,155,0.1)]"
                    }
                  `}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-brs-400" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ... CTA ... */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/membership-form"
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-brs-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brs-500 hover:scale-[1.03] hover:shadow-[0_0_28px_rgba(58,125,94,0.45)]"
            >
              Become a Member
            </Link>

            {/* ... Mobile Hamburger ... */}
            <div className="lg:hidden">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                {/* ... Trigger ... */}
                <SheetTrigger
                  className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.05] p-2.5 text-brs-400 transition-all duration-200 hover:bg-white/[0.12] hover:text-brs-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brs-400/50"
                  aria-label="Open menu"
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </SheetTrigger>

                <SheetContent
                  side="right"
                  showCloseButton={false}
                  className="!bg-brs-900/95 !backdrop-blur-2xl !border-white/[0.08] w-[300px] sm:w-[340px] p-0"
                >
                  {/* Drawer Header */}
                  <SheetHeader className="border-b border-white/[0.07] px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-brs-400/25">
                          <Image
                            src="/logo_high_res_v4.png"
                            alt="BRS India logo"
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        </div>
                        <SheetTitle className="!text-brs-100 text-base font-bold tracking-tight">
                          BRS India
                        </SheetTitle>
                      </div>
                      <SheetClose className="rounded-lg p-1.5 text-brs-400/70 transition-all duration-200 hover:bg-white/[0.08] hover:text-brs-100">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close</span>
                      </SheetClose>
                    </div>
                  </SheetHeader>

                  {/* Drawer Links */}
                  <div className="flex flex-col px-3 py-4 gap-1">
                    {navLinks.map((link, index) => {
                      const active = isActive(link.href);
                      const hasChildren = !!link.children;
                      
                      if (hasChildren) {
                        return (
                          <div key={link.label} className="space-y-1">
                            <div
                              className={`
                                flex items-center justify-between rounded-xl px-4 py-3.5
                                text-[15px] font-medium text-brs-400/60
                              `}
                            >
                              <span>{link.label}</span>
                            </div>
                            <div className="pl-4 space-y-1 border-l border-white/10 ml-4">
                              {link.children?.map((child) => (
                                <Link
                                  key={child.label}
                                  href={child.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="flex items-center justify-between rounded-xl px-4 py-3 text-[14px] text-brs-400/85 hover:bg-white/[0.05]"
                                >
                                  {child.label}
                                  <ChevronRight className="h-3 w-3 opacity-30" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            group flex items-center justify-between rounded-xl px-4 py-3.5
                            text-[15px] font-medium transition-all duration-200
                            ${active
                              ? "bg-brs-600/30 text-white border border-brs-400/20"
                              : "text-brs-400/85 border border-transparent hover:bg-white/[0.07] hover:text-brs-100 hover:border-white/[0.08]"
                            }
                          `}
                          style={{
                            animation: `fade-slide-in 0.35s ease-out ${index * 0.055}s both`,
                          }}
                        >
                          <span>{link.label}</span>
                          <ChevronRight
                            className={`h-4 w-4 transition-all duration-200 group-hover:translate-x-0.5 ${
                              active ? "text-brs-400" : "text-brs-400/30 group-hover:text-brs-400/70"
                            }`}
                          />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Drawer CTA */}
                  <div className="mt-auto border-t border-white/[0.07] p-4">
                    <Link
                      href="/membership-form"
                      onClick={() => setMobileOpen(false)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-brs-600 px-5 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-brs-500 hover:shadow-[0_0_24px_rgba(58,125,94,0.4)]"
                      style={{
                        animation: "fade-slide-in 0.35s ease-out 0.33s both",
                      }}
                    >
                      Become a Member
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
