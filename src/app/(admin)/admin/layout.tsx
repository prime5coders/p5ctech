// ===========================================
// Admin Dashboard Layout
// Sidebar navigation with glassmorphism,
// isolated from marketing layout
// ===========================================

import Link from "next/link";
import { auth } from "@/auth";
import { ArrowLeft } from "lucide-react";
import SidebarLink from "./sidebar-link";
import LogoutButton from "./logout-button";

const adminNav = [
    { label: "Overview", href: "/admin", iconName: "LayoutDashboard" },
    { label: "Contacts", href: "/admin/contacts", iconName: "MessageSquare" },
    { label: "Subscribers", href: "/admin/subscribers", iconName: "Users" },
    { label: "Users", href: "/admin/users", iconName: "UserCog" },
];

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Middleware handles auth redirection, but as a fallback/type safety
    // if accessed improperly, render nothing while middleware redirects
    if (!session) {
        return null;
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
                            iconName={item.iconName}
                        />
                    ))}
                </nav>

                {/* Spacer + Logout */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="border-t border-border/50 pt-4">
                        <p className="mb-3 truncate px-3 text-xs text-muted-foreground">
                            {session.user?.email}
                        </p>
                        <LogoutButton />
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <main className="ml-64 flex-1 p-8">{children}</main>
        </div>
    );
}
