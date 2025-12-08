"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const treatments = [
    {
        title: "Teeth Whitening",
        description: "Professional whitening for a brighter, more confident smile",
        beforeImage: "/images/treatments/whitening-before.png",
        afterImage: "/images/treatments/whitening-after.png",
    },
    {
        title: "Orthodontics",
        description: "Achieve perfectly aligned teeth with our advanced orthodontic solutions",
        beforeImage: "/images/treatments/ortho-before12.png",
        afterImage: "/images/treatments/ortho-after12.png",
    },
    {
        title: "Dental Veneers",
        description: "Transform your smile with custom-crafted porcelain veneers",
        beforeImage: "/images/treatments/veneers-before.png",
        afterImage: "/images/treatments/veneers-after.png",
    },
    {
        title: "Dental Crowns",
        description: "Restore damaged teeth with durable, natural-looking crowns",
        beforeImage: "/images/treatments/crowns-before.png",
        afterImage: "/images/treatments/crowns-after.png",
    },
    {
        title: "Dental Implants",
        description: "Replace missing teeth with permanent, life-like implants",
        beforeImage: "/images/treatments/implants-before123.png",
        afterImage: "/images/treatments/implants-after123.png",
    },
];

export function BeforeAfter() {
    return (
        <section className="py-20 bg-gradient-to-b from-background to-blue-50/30">
            <div className="container px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Real Results, Real Smiles
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        See the transformative power of our dental treatments
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {treatments.map((treatment, index) => (
                        <motion.div
                            key={treatment.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl transition-all duration-500 border border-gray-100">
                                {/* Before/After Images Container */}
                                <div className="relative mb-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Before Image */}
                                        <div className="relative">
                                            <div className="absolute -top-3 left-2 z-10 bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                Before
                                            </div>
                                            <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                                                <Image
                                                    src={treatment.beforeImage}
                                                    alt={`${treatment.title} - Before`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* After Image */}
                                        <div className="relative">
                                            <div className="absolute -top-3 right-2 z-10 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                                After
                                            </div>
                                            <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100 ring-2 ring-blue-500/20">
                                                <Image
                                                    src={treatment.afterImage}
                                                    alt={`${treatment.title} - After`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrow Indicator */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                        <div className="bg-white rounded-full p-2 shadow-lg">
                                            <ArrowRight className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Treatment Info */}
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-foreground">
                                        {treatment.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {treatment.description}
                                    </p>
                                </div>

                                {/* Hover Effect Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
