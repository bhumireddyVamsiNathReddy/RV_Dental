"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const images = [
    { src: "/images/clinic1.png", alt: "Reception Area", className: "md:col-span-2 md:row-span-2" },
    { src: "/images/clinic2.png", alt: "Treatment Room", className: "md:col-span-1 md:row-span-1" },
    { src: "/images/clinic3.png", alt: "Dental Tools", className: "md:col-span-1 md:row-span-1" },
];

export function Gallery() {
    return (
        <section id="gallery" className="py-24 bg-secondary/30">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Our Space</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Designed for tranquility. A modern sanctuary where dental care meets comfort.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">
                    {images.map((img, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative rounded-3xl overflow-hidden shadow-lg group ${img.className}`}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
