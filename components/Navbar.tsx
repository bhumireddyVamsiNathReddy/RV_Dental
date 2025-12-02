"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Gallery", href: "/#gallery" },
    { name: "Doctors", href: "/#doctors" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4"
        >
            <nav className="flex items-center justify-between w-full max-w-5xl px-6 py-3 bg-white/70 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl">
                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white shadow-sm">
                        <Image
                            src="/logo.png"
                            alt="RV Dental Logo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        RV Dental
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-primary",
                                pathname === link.href ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/book">
                        <Button variant="primary" size="sm" className="rounded-full px-6">
                            Book Now
                        </Button>
                    </Link>
                </div>
            </nav>
        </motion.header>
    );
}
