"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/app/assets/icons/logo.svg";

export default function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black pt-16 pb-8">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <Image src={Logo} alt="Vroom" width={112} height={40} className="w-28 h-auto" />
                        </Link>
                        <p className="text-gray-400 max-w-sm mb-6">
                            Your smart partner for car & bike care. Doorstep service, emergency help, and vehicle health tracking.
                        </p>
                        <div className="flex gap-4">
                            {/* Social icons placeholders */}
                            {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                                <div key={social} className="h-8 w-8 bg-white/5 rounded-full flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                                    <span className="sr-only">{social}</span>
                                    <div className="h-4 w-4 bg-current rounded-sm" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Product</h3>
                        <ul className="space-y-4">
                            {['Services', 'Health Check', 'Emergency', 'Modifications'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-6">Company</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Careers', 'Privacy Policy', 'Terms of Service'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Vroom Automotive. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
