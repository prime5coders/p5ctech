// ===========================================
// Landing Page
// Composes all marketing sections into a
// single scrollable page experience
// ===========================================

import { GoldenHeroDynamic } from "@/components/sections/scroll-hero-3d-wrapper";
import { ServicesSection } from "@/components/sections/services";
import { PortfolioSection } from "@/components/sections/portfolio";
import { PricingSection } from "@/components/sections/pricing";
import { ContactSection } from "@/components/sections/contact";
import { NewsletterSection } from "@/components/sections/newsletter";

export default function HomePage() {
    return (
        <>
            <GoldenHeroDynamic />
            <ServicesSection />
            <PortfolioSection />
            <PricingSection />
            <ContactSection />
            <NewsletterSection />
        </>
    );
}
