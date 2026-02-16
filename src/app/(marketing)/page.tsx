// ===========================================
// Landing Page
// Composes all marketing sections into a
// single scrollable page experience
// ===========================================

import { HeroSection } from "@/components/sections/hero";
import { ServicesSection } from "@/components/sections/services";
import { PortfolioSection } from "@/components/sections/portfolio";
import { TestimonialsSection } from "@/components/sections/testimonials";
import { PricingSection } from "@/components/sections/pricing";
import { ContactSection } from "@/components/sections/contact";
import { NewsletterSection } from "@/components/sections/newsletter";

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <PortfolioSection />
            <TestimonialsSection />
            <PricingSection />
            <ContactSection />
            <NewsletterSection />
        </>
    );
}
