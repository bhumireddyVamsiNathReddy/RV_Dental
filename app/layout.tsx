import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RV Dental | Best Dental Clinic in Kadapa",
  description: "Expert dental care in Kadapa - Cosmetic dentistry, implants, braces & more. Book appointment with Dr. Veera Reddy. Premium treatments in a calming environment.",
  keywords: ["Dentist in Kadapa", "Dental Clinic Kadapa", "Best Dental Hospital Kadapa", "Teeth Cleaning Kadapa", "Root Canal Treatment Kadapa", "RV Dental", "Cosmetic Dentistry Kadapa", "Dental Implants Kadapa"],
  openGraph: {
    title: "RV Dental | Best Dental Clinic in Kadapa",
    description: "Expert dental care in Kadapa. Cosmetic dentistry, implants, braces & more. Book with Dr. Veera Reddy.",
    url: "https://www.rvdental.net",
    siteName: "RV Dental",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  verification: {
    google: "u4KbB2vWrVvNaEkvh_rM2vu2NTXxJEE7_R-GzHQ4LOE",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Dentist",
      "@id": "https://www.rvdental.net/#localbusiness",
      "name": "RV Dental",
      "image": "https://www.rvdental.net/images/doctor_img.png",
      "url": "https://www.rvdental.net",
      "telephone": "+919493195941",
      "priceRange": "₹₹",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Opposite Kadapa RTC Bus Stand",
        "addressLocality": "Kadapa",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "516001",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 14.4673,
        "longitude": 78.8242
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      },
      "sameAs": [
        "https://www.instagram.com/rvaesthetics99",
        "https://www.facebook.com/share/17dgbAv5NB/",
        "https://x.com/RvAesthetics9"
      ],
      "founder": {
        "@type": "Person",
        "name": "Dr. G. Veera Reddy",
        "jobTitle": "Dentist"
      },
      "areaServed": [
        {
          "@type": "City",
          "name": "Kadapa"
        },
        {
          "@type": "City",
          "name": "Proddatur"
        },
        {
          "@type": "City",
          "name": "Pulivendula"
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.rvdental.net"
        }
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
