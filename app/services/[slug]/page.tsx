import { services } from "@/lib/services";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        return {
            title: "Service Not Found | RV Dental",
        };
    }

    return {
        title: `${service.title} in Kadapa | RV Dental`,
        description: `${service.description} Best ${service.title} treatment in Kadapa at RV Dental by Dr. G. Veera Reddy.`,
        openGraph: {
            title: `${service.title} in Kadapa | RV Dental`,
            description: service.description,
            images: [service.image],
        },
    };
}

export default async function ServicePage({ params }: Props) {
    const { slug } = await params;
    const service = services.find((s) => s.slug === slug);

    if (!service) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Service",
                "name": service.title,
                "provider": {
                    "@id": "https://www.rvdental.net/#localbusiness"
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Kadapa"
                },
                "description": service.description,
                "image": `https://www.rvdental.net${service.image}`
            },
            {
                "@type": "Dentist",
                "@id": "https://www.rvdental.net/#localbusiness",
                "name": "RV Dental",
                "image": "https://www.rvdental.net/images/doctor_img.png",
                "founder": {
                    "@type": "Person",
                    "name": "Dr. G. Veera Reddy"
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Opposite Kadapa RTC Bus Stand",
                    "addressLocality": "Kadapa",
                    "addressRegion": "Andhra Pradesh",
                    "postalCode": "516001",
                    "addressCountry": "IN"
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://www.rvdental.net"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": service.title,
                        "item": `https://www.rvdental.net/services/${slug}`
                    }
                ]
            }
        ]
    };

    return (
        <main className="min-h-screen bg-background pt-24 pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container px-4 md:px-6">
                <div className="mx-auto max-w-4xl">
                    {/* Breadcrumb Visual */}
                    <nav className="flex mb-8 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-foreground">{service.title}</span>
                    </nav>

                    <div className="space-y-8">
                        {/* Hero Section of the Service Page */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-lg">
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                                {service.title}
                            </h1>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                {service.description}
                            </p>

                            <div className="bg-secondary/30 p-8 rounded-2xl border border-secondary">
                                <h3 className="text-2xl font-semibold mb-4">Why Choose RV Dental for {service.title}?</h3>
                                <ul className="space-y-3 list-disc list-inside text-muted-foreground">
                                    <li>Expert Care by Dr. G. Veera Reddy</li>
                                    <li>State-of-the-art Technology</li>
                                    <li>Pain-free Treatment Protocols</li>
                                    <li>Affordable Styling & Care</li>
                                </ul>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Link
                                    href="/book"
                                    className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    Book Appointment
                                </Link>
                                <Link
                                    href="https://wa.me/919493195941"
                                    target="_blank"
                                    className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                >
                                    WhatsApp Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
