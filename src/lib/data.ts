// ===========================================
// P5C Tech - Static Content Data
// All marketing site content in one place for
// easy editing without touching components
// ===========================================

import {
    Globe,
    Smartphone,
    Palette,
    Zap,
    Shield,
    BarChart3,
    type LucideIcon,
} from "lucide-react";

/* ---- Services ---- */
export interface Service {
    icon: LucideIcon;
    title: string;
    description: string;
}

export const services: Service[] = [
    {
        icon: Globe,
        title: "Web Development",
        description:
            "Custom web applications built with Next.js, React, and TypeScript. Blazing fast, SEO-optimized, and production-ready.",
    },
    {
        icon: Smartphone,
        title: "Mobile-First Design",
        description:
            "Responsive interfaces that look stunning on every device. Pixel-perfect implementation with modern design patterns.",
    },
    {
        icon: Palette,
        title: "UI/UX Design",
        description:
            "Beautiful, intuitive interfaces designed with user experience at the core. From wireframes to polished prototypes.",
    },
    {
        icon: Zap,
        title: "Performance Optimization",
        description:
            "Lightning-fast page loads, Core Web Vitals optimization, and server-side rendering for maximum performance.",
    },
    {
        icon: Shield,
        title: "Security & DevOps",
        description:
            "Enterprise-grade security, CI/CD pipelines, cloud deployment on Vercel, AWS, and modern infrastructure.",
    },
    {
        icon: BarChart3,
        title: "Analytics & Growth",
        description:
            "Data-driven strategies with built-in analytics, A/B testing, and conversion optimization for measurable results.",
    },
];

/* ---- Portfolio Projects ---- */
export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    imageUrl: string;
    liveUrl: string;
}

export const projects: Project[] = [
    {
        id: "1",
        title: "FinLearn Platform",
        description:
            "AI-powered financial education platform with personalized fund recommendations, real-time market data, SIP/Lump-Sum advisory, and an intelligent chatbot for beginner investors.",
        tags: ["Spring Boot", "Flutter", "Gemini AI", "PostgreSQL"],
        imageUrl: "/projects/finlearn.jpg",
        liveUrl: "#",
    },
    {
        id: "2",
        title: "Electricity Demand Forecasting",
        description:
            "ML-powered dashboard for predicting electricity consumption using ensemble models — XGBoost, LightGBM, Random Forest, and Prophet with time-based feature engineering.",
        tags: ["Python", "XGBoost", "Prophet", "Flask"],
        imageUrl: "/projects/electricity.jpg",
        liveUrl: "#",
    },
    {
        id: "3",
        title: "Fraud Detection Network",
        description:
            "Real-time transaction monitoring system with interactive 2D/3D network graphs, origin tracing, escape route mapping, and WebSocket-driven live threat visualization.",
        tags: ["React", "D3.js", "Three.js", "WebSocket"],
        imageUrl: "/projects/fraud.jpg",
        liveUrl: "#",
    },
    {
        id: "4",
        title: "Chat Analysis App",
        description:
            "WhatsApp chat analytics tool with sentiment analysis, message frequency stats, word clouds, dark/light themes, bookmarks, search, and haptic feedback on mobile.",
        tags: ["Flutter", "Dart", "NLP", "Charts"],
        imageUrl: "/projects/chatanalysis.jpg",
        liveUrl: "#",
    },
    {
        id: "5",
        title: "GrammarFlow Extension",
        description:
            "Stealth browser extension that unblocks paste/copy restrictions on websites with a Grammarly-style UI, auto-enable on fullscreen, and cross-browser support.",
        tags: ["JavaScript", "Chrome API", "Firefox API", "CSS"],
        imageUrl: "/projects/grammarflow.jpg",
        liveUrl: "#",
    },
    {
        id: "6",
        title: "Stealth Browser",
        description:
            "Custom Electron-based web browser with built-in stealth chatbot sidebar, page content scanning, toolbar controls, and a modern tab-based interface.",
        tags: ["Electron", "TypeScript", "Node.js", "IPC"],
        imageUrl: "/projects/browser.jpg",
        liveUrl: "#",
    },
    {
        id: "7",
        title: "CloudSync Dashboard",
        description:
            "Enterprise cloud management dashboard with real-time monitoring, automated scaling, and comprehensive analytics for multi-cloud infrastructure.",
        tags: ["React", "Node.js", "AWS", "GraphQL"],
        imageUrl: "/projects/cloudsync.jpg",
        liveUrl: "#",
    },
    {
        id: "8",
        title: "Meridian E-Commerce",
        description:
            "High-converting e-commerce platform with AI-driven product recommendations, inventory management, and seamless Stripe payment integration.",
        tags: ["Next.js", "Stripe", "Prisma", "Tailwind"],
        imageUrl: "/projects/meridian.jpg",
        liveUrl: "#",
    },
];

/* ---- Testimonials ---- */
export interface Testimonial {
    id: string;
    name: string;
    role: string;
    content: string;
    rating: number;
}

export const testimonials: Testimonial[] = [
    {
        id: "1",
        name: "Sarah Chen",
        role: "CTO at ScaleUp Labs",
        content:
            "P5C Tech transformed our entire digital presence. Their attention to detail and engineering excellence is unmatched. The performance improvements alone boosted our conversion by 40%.",
        rating: 5,
    },
    {
        id: "2",
        name: "Marcus Rivera",
        role: "Founder of Meridian",
        content:
            "Working with P5C Tech felt like having a world-class engineering team on demand. They delivered a product that exceeded every expectation — on time and on budget.",
        rating: 5,
    },
    {
        id: "3",
        name: "Aisha Patel",
        role: "VP Product at CloudFlow",
        content:
            "The UI they designed is so intuitive that our customer support tickets dropped by 60%. P5C Tech doesn't just build software — they build experiences.",
        rating: 5,
    },
    {
        id: "4",
        name: "James O'Connor",
        role: "CEO at Northbound",
        content:
            "From concept to launch in 6 weeks. The team's velocity and code quality are exceptional. They're our go-to partner for all new digital initiatives.",
        rating: 5,
    },
];

/* ---- Pricing Tiers ---- */
export interface PricingTier {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    cta: string;
    popular: boolean;
}

export const pricingTiers: PricingTier[] = [
    {
        name: "Starter",
        price: "$2,499",
        period: "per project",
        description: "Perfect for small businesses and MVPs.",
        features: [
            "Landing page or single-page app",
            "Responsive design",
            "Basic SEO setup",
            "Contact form integration",
            "2 rounds of revisions",
            "1 month support",
        ],
        cta: "Get Started",
        popular: false,
    },
    {
        name: "Professional",
        price: "$7,999",
        period: "per project",
        description: "For growing businesses that need scale.",
        features: [
            "Full-stack web application",
            "Custom UI/UX design",
            "Database architecture",
            "API development",
            "Authentication & security",
            "Performance optimization",
            "CI/CD pipeline setup",
            "3 months support",
        ],
        cta: "Start Building",
        popular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        period: "tailored pricing",
        description: "For teams that need dedicated partnership.",
        features: [
            "Everything in Professional",
            "Dedicated project lead",
            "Priority support (24/7)",
            "Custom integrations",
            "Advanced analytics",
            "Scalability planning",
            "On-call engineering",
            "12 months support",
        ],
        cta: "Contact Us",
        popular: false,
    },
];

/* ---- Navigation ---- */
export const navLinks = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
] as const;

/* ---- Company Stats ---- */
export const stats = [
    { value: "50+", label: "Projects Delivered" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "3x", label: "Average ROI" },
    { value: "24/7", label: "Support Available" },
] as const;
