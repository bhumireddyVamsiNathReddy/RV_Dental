"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const services = [
    {
        title: "Cosmetic Dentistry",
        description: "Transform your smile with teeth whitening, veneers, and complete smile makeovers designed to boost your confidence.",
        image: "/images/service_cosmetic.png",
    },
    {
        title: "Dental Veneers",
        description: "Premium porcelain veneers for a flawless, natural-looking smile that lasts for years.",
        image: "/images/service_veeners.jpg",
    },
    {
        title: "Orthodontics",
        description: "Advanced orthodontic solutions including clear aligners, braces, and the Damon System for perfect alignment.",
        image: "/images/service_ortho.webp",
    },
    {
        title: "Invisible Aligners",
        description: "Discreet clear aligners for straightening teeth without the look of traditional braces.",
        image: "/images/service_InvisibleBraces.jpg",
    },

    {
        title: "Damon System",
        description: "Self-ligating braces technology for faster treatment, fewer appointments, and greater comfort.",
        image: "/images/service_demonbraces.jpg",
    },
    {
        title: "Zirconia Crowns",
        description: "High-strength, natural-looking zirconia ceramic crowns for durable and aesthetic tooth restoration.",
        image: "/images/service_zirconia.webp",
    },
    {
        title: "Root Canal Treatment",
        description: "Advanced endodontic care to save infected teeth and relieve pain with precision and comfort.",
        image: "/images/service_RootCanal.webp",
    },
    {
        title: "Bridges",
        description: "Restore your smile and bite function with custom-fitted dental bridges that seamlessly replace missing teeth.",
        image: "/images/service_bridges.png",
    },
    {
        title: "Smile Designing",
        description: "A comprehensive cosmetic approach to plan and create your perfect smile using advanced digital technology.",
        image: "/images/smile-designing.jpeg",
    },
    {
        title: "Dental Implants",
        description: "Permanent, natural-looking solution for replacing missing teeth, restoring both function and aesthetics.",
        image: "/images/service_implants.png",
    },
];

export function Services() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Our Services</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        We do all services related to dental. Expert care tailored to your unique needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
