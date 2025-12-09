"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            <div className="container px-4 md:px-6 py-12">
                {/* Main Heading at Top */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-center mb-12 md:mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground mb-6">
                        Smile with <br />
                        <span className="text-primary">Confidence.</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Experience premium dental care in Kadapa. Minimalist care, advanced technology, and a calming environment designed for your comfort.
                    </p>
                </motion.div>

                {/* Doctor Section - Image and Description */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 max-w-6xl mx-auto">
                    {/* Doctor Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[550px] rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/doctor_img.png"
                                alt="Dr. Veera Reddy"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 90vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </div>
                    </motion.div>

                    {/* Doctor Description */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                        className="w-full lg:w-1/2 space-y-6"
                    >
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-2">Dr. G.Veera Reddy <span className="text-lg font-normal ml-2">M.D.S</span></h2>
                            <p className="text-xl text-primary font-medium">Orthodontist</p>
                        </div>

                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Dr. G.Veera Reddy has over 25 years of experience in creating beautiful smiles.
                            He specializes in Invisalign and cosmetic dentistry, bringing expertise
                            and compassion to every patient interaction.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link href="/book">
                                <Button size="lg" className="rounded-full px-8 text-lg h-14 w-full sm:w-auto">
                                    Book Appointment
                                </Button>
                            </Link>
                            <Link href="#gallery">
                                <Button variant="ghost" size="lg" className="rounded-full px-8 text-lg h-14 w-full sm:w-auto">
                                    View Gallery
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div >

            <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl opacity-50 translate-x-1/3 -translate-y-1/4" />
            <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl opacity-50 -translate-x-1/3 translate-y-1/4" />
        </section >
    );
}
