"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/icons/logo.svg";

import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#F8F9FB] border-t border-[#E4E7EC] pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 animate-in fade-in duration-1000">
                    <div className="md:col-span-2 flex flex-col items-start gap-8">
                        <Link href="/" className="inline-block transition-transform hover:scale-105 active:scale-95">
                            <Image src={Logo} alt="Vroom" width={140} height={48} className="w-36 h-auto object-contain brightness-0" priority />
                        </Link>
                        <p className="text-[#475569] text-xs max-w-sm leading-relaxed font-black uppercase tracking-[0.3em]">
                            Redefining the automotive service experience through intelligent networking.
                        </p>
                        <div className="flex items-center gap-4">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="h-12 w-12 rounded-2xl bg-white border border-[#E4E7EC] flex items-center justify-center text-[#94A3B8] hover:text-[#6B2FA0] hover:border-[#6B2FA0]/50 transition-all hover:-translate-y-1"
                                >
                                    <Icon className="h-5 w-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-[#0F172A] font-black uppercase text-[10px] tracking-[0.3em] mb-10">Platform</h4>
                        <nav className="flex flex-col gap-6">
                            {['How It Works', 'Why Vroom', 'Service Status'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] hover:text-[#6B2FA0] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-[#0F172A] font-black uppercase text-[10px] tracking-[0.3em] mb-10">Company</h4>
                        <nav className="flex flex-col gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-[#475569] hover:text-[#6B2FA0] transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="pt-12 border-t border-[#E4E7EC] flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#94A3B8]">
                        © {new Date().getFullYear()} Vroom Technologies Inc.
                    </span>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#DCFCE7] border border-[#DCFCE7]">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6B2FA0]"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6B2FA0]">Network Operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
