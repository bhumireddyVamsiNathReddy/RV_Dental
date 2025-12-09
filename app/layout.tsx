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
  description: "Experience premium dental care in Kadapa at RV Dental. Expert treatments, advanced technology, and a calming environment. Book your appointment today.",
  keywords: ["Dentist in Kadapa", "Dental Clinic Kadapa", "Best Dental Hospital Kadapa", "Teeth Cleaning Kadapa", "Root Canal Treatment Kadapa", "RV Dental"],
  openGraph: {
    title: "RV Dental | Best Dental Clinic in Kadapa",
    description: "Premium dental care in Kadapa. Expert treatments and advanced technology.",
    url: "https://www.rvdental.net",
    siteName: "RV Dental",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "RV Dental",
  "image": "https://www.rvdental.net/images/doctor_img.png",
  "@id": "https://www.rvdental.net",
  "url": "https://www.rvdental.net",
  "telephone": "+919493195941",
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
