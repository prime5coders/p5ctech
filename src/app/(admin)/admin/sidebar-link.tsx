"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    MessageSquare,
    Users,
    UserCog,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    LayoutDashboard,
    MessageSquare,
    Users,
    UserCog,
};

interface SidebarLinkProps {
    href: string;
    label: string;
    iconName: string;
}

export default function SidebarLink({ href, label, iconName }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive =
        pathname === href ||
        (href !== "/admin" && pathname.startsWith(href));

    const Icon = iconMap[iconName] || LayoutDashboard;

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground"
            )}
        >
            <Icon size={18} />
            {label}
        </Link>
    );
}
