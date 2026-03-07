"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/icons/logo.svg";

import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-primary-theme border-t border-secondary-theme/30 pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="md:col-span-2 flex flex-col items-start gap-6">
                        <Link href="/" className="inline-block transition-transform hover:scale-105">
                            <Image src={Logo} alt="Vroom" width={112} height={40} className="w-32 h-auto" />
                        </Link>
                        <p className="text-gray-500 text-sm max-w-sm leading-relaxed font-black uppercase tracking-widest pt-2">
                            The smarter way to manage vehicle care.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
                                <Link
                                    key={i}
                                    href="#"
                                    className="h-10 w-10 rounded-full bg-primaryCard border border-secondary-theme flex items-center justify-center text-gray-500 hover:text-theme-green hover:border-theme-green/30 transition-all hover:-translate-y-1"
                                >
                                    <Icon className="h-4 w-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">Platform</h4>
                        <nav className="flex flex-col gap-4">
                            {['How It Works', 'Why Vroom', 'Service Status'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-8">Company</h4>
                        <nav className="flex flex-col gap-4">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>

                <div className="pt-12 border-t border-secondary-theme/30 flex flex-col md:flex-row items-center justify-between gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
                        © {new Date().getFullYear()} Vroom Technologies Inc.
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-theme-green animate-pulse"></span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-green">All systems operational</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
