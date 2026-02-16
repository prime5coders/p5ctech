// ===========================================
// Marketing Layout
// Wraps all public-facing pages with Navbar
// and Footer. Isolated from admin layout.
// ===========================================

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </>
    );
}
