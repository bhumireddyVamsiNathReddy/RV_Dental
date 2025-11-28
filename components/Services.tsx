"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const services = [
    {
        title: "General Dentistry",
        description: "Comprehensive checkups, cleanings, and preventive care to keep your smile healthy.",
        image: "/images/service_general.png",
    },
    {
        title: "Cosmetic Dentistry",
        description: "Teeth whitening, veneers, and smile makeovers designed to boost your confidence.",
        image: "/images/service_cosmetic.png",
    },
    {
        title: "Orthodontics",
        description: "Clear aligners and modern braces for a perfectly aligned, functional smile.",
        image: "/images/service_ortho.png",
    },
    {
        title: "Pediatric Dentistry",
        description: "Gentle, fun, and educational dental care tailored specifically for children.",
        image: "/images/service_kids.png",
    },
];

export function Services() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Our Services</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Expert care tailored to your unique needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group rounded-3xl overflow-hidden bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-6 space-y-2">
                                <h3 className="text-xl font-semibold">{service.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
