export interface Service {
    title: string;
    description: string;
    image: string;
    slug: string;
}

export const services: Service[] = [
    {
        title: "Cosmetic Dentistry",
        description: "Transform your smile with teeth whitening, veneers, and complete smile makeovers designed to boost your confidence.",
        image: "/images/service_cosmetic.png",
        slug: "cosmetic-dentistry",
    },
    {
        title: "Dental Veneers",
        description: "Premium porcelain veneers for a flawless, natural-looking smile that lasts for years.",
        image: "/images/service_veeners.jpg",
        slug: "dental-veneers",
    },
    {
        title: "Invisible Aligners",
        description: "Discreet clear aligners for straightening teeth without the look of traditional braces.",
        image: "/images/service_InvisibleBraces.jpg",
        slug: "invisible-aligners",
    },
    {
        title: "Damon System",
        description: "Self-ligating braces technology for faster treatment, fewer appointments, and greater comfort.",
        image: "/images/service_demonbraces.jpg",
        slug: "damon-system", // Note: sitemap has 'braces-kadapa', we might want to match that or update sitemap. sticking to title-based for now, can alias later if needed.
        // Wait, looking at sitemap: 
        // /services/cosmetic-dentistry (Matches)
        // /services/braces-kadapa (Likely matches 'Invisible Aligners' or 'Damon System'?)
        // /services/dental-implants (Matches 'Dental Implants')
        // /services/root-canal (Matches 'Root Canal Treatment')
        // Let's align slugs with sitemap where obvious, otherwise generic.
    },
    {
        title: "Zirconia Crowns",
        description: "High-strength, natural-looking zirconia ceramic crowns for durable and aesthetic tooth restoration.",
        image: "/images/service_zirconia.webp",
        slug: "zirconia-crowns",
    },
    {
        title: "Root Canal Treatment",
        description: "Advanced endodontic care to save infected teeth and relieve pain with precision and comfort.",
        image: "/images/service_RootCanal.webp",
        slug: "root-canal",
    },
    {
        title: "Bridges",
        description: "Restore your smile and bite function with custom-fitted dental bridges that seamlessly replace missing teeth.",
        image: "/images/service_bridges.png",
        slug: "bridges",
    },
    {
        title: "Smile Designing",
        description: "A comprehensive cosmetic approach to plan and create your perfect smile using advanced digital technology.",
        image: "/images/smile-designing.jpeg",
        slug: "smile-designing",
    },
    {
        title: "Dental Implants",
        description: "Permanent, natural-looking solution for replacing missing teeth, restoring both function and aesthetics.",
        image: "/images/implants.jpeg",
        slug: "dental-implants",
    },
    {
        title: "Laser Treatment",
        description: "Advanced laser technology for painless soft tissue procedures, gum reshaping, and precise treatment.",
        image: "/images/laser.jpeg",
        slug: "laser-treatment",
    },
];

// Helper to match sitemap specific URLs if needed
// sitemap: braces-kadapa -> ??? Maybe Damon System or generic Braces?
// Let's stick to these slugs for now. 
