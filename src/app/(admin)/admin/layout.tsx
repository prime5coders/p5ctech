// ===========================================
// Admin Dashboard Layout
// Sidebar navigation with glassmorphism,
// isolated from marketing layout
// ===========================================

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    UserCog,
    ArrowLeft,
} from "lucide-react";
import SidebarLink from "./sidebar-link";

const adminNav = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Contacts", href: "/admin/contacts", icon: MessageSquare },
    { label: "Subscribers", href: "/admin/subscribers", icon: Users },
    { label: "Users", href: "/admin/users", icon: UserCog },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border/50 bg-sidebar p-6">
                {/* Back to site */}
                <Link
                    href="/"
                    className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft size={16} />
                    Back to site
                </Link>

                {/* Logo */}
                <div className="mb-10 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
                        <span className="text-sm font-bold gradient-text">P5</span>
                    </div>
                    <div>
                        <p className="text-sm font-bold">P5C Tech</p>
                        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    {adminNav.map((item) => (
                        <SidebarLink
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            icon={item.icon}
                        />
                    ))}
                </nav>
            </aside>

            {/* Main content area */}
            <main className="ml-64 flex-1 p-8">{children}</main>
        </div>
    );
}
