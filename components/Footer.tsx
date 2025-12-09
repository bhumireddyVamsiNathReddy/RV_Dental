import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-secondary pt-16 pb-8">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Brand & Description */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold">RV Dental</h3>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            Experience dentistry reimagined. Minimalist care, advanced technology, and a calming environment.
                        </p>
                        <div className="flex gap-4">
                            <Link href="https://www.instagram.com/rvaesthetics99?igsh=MW90YW9sMXJnMHF5bQ==" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.facebook.com/share/17dgbAv5NB/" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="https://x.com/RvAesthetics9" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/#services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link href="/#gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
                            <li><Link href="/book" className="hover:text-primary transition-colors">Book Appointment</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold">Contact Us</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <a
                                    href="https://maps.app.goo.gl/27wKYbcREX7UPaLs6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors"
                                >
                                    RvDental,<br />
                                    Opposite Kadapa RTC Bus Stand,<br />
                                    Kadapa - 516001
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+91 9493195941</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>rvaesthetics9@gmail.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} RV Dental. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
