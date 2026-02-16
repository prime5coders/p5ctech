// ===========================================
// Admin Dashboard - Overview Page
// Summary cards showing totals from API data
// ===========================================

"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Users, FolderKanban, TrendingUp } from "lucide-react";

interface DashboardData {
    totalContacts: number;
    totalSubscribers: number;
    activeSubscribers: number;
}

export default function AdminDashboardPage() {
    const [data, setData] = useState<DashboardData>({
        totalContacts: 0,
        totalSubscribers: 0,
        activeSubscribers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [contactsRes, subsRes] = await Promise.all([
                    fetch("/api/admin/contacts"),
                    fetch("/api/admin/subscribers"),
                ]);

                const contacts = await contactsRes.json();
                const subs = await subsRes.json();

                setData({
                    totalContacts: contacts.total || 0,
                    totalSubscribers: subs.total || 0,
                    activeSubscribers: subs.active || 0,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const cards = [
        {
            label: "Total Contacts",
            value: data.totalContacts,
            icon: MessageSquare,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Total Subscribers",
            value: data.totalSubscribers,
            icon: Users,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            label: "Active Subscribers",
            value: data.activeSubscribers,
            icon: TrendingUp,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
        {
            label: "Projects",
            value: 4,
            icon: FolderKanban,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your agency&apos;s data and metrics.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-border/50 bg-card/50 p-6"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">{card.label}</p>
                            <div className={`rounded-lg p-2 ${card.bg}`}>
                                <card.icon size={18} className={card.color} />
                            </div>
                        </div>
                        <p className="mt-3 text-3xl font-bold">
                            {loading ? (
                                <span className="inline-block h-8 w-16 animate-pulse rounded bg-muted" />
                            ) : (
                                card.value
                            )}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick info */}
            <div className="mt-12 rounded-xl border border-border/50 bg-card/50 p-6">
                <h2 className="text-lg font-semibold">Quick Start</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    This dashboard provides a real-time overview of your agency metrics.
                    Navigate to <strong>Contacts</strong> to view form submissions or{" "}
                    <strong>Subscribers</strong> to manage your newsletter list. All data
                    is powered by the PostgreSQL database via Prisma ORM.
                </p>
            </div>
        </div>
    );
}
