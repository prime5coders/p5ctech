"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SidebarLinkProps {
    href: string;
    label: string;
    icon: LucideIcon;
}

export default function SidebarLink({ href, label, icon: Icon }: SidebarLinkProps) {
    const pathname = usePathname();
    const isActive =
        pathname === href ||
        (href !== "/admin" && pathname.startsWith(href));

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
