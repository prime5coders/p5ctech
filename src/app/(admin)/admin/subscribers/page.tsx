// ===========================================
// Admin - Subscribers Page
// Table listing all newsletter subscribers
// ===========================================

"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Subscriber {
    id: string;
    email: string;
    active: boolean;
    subscribedAt: string;
}

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSubscribers() {
            try {
                const res = await fetch("/api/admin/subscribers");
                const data = await res.json();
                setSubscribers(data.subscribers || []);
            } catch (error) {
                console.error("Failed to fetch subscribers:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSubscribers();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your newsletter subscriber list.
                </p>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Subscribed Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="border-b border-border/30">
                                        {Array.from({ length: 3 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <span className="inline-block h-4 w-32 animate-pulse rounded bg-muted" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        No subscribers yet. They&apos;ll appear here once someone
                                        subscribes to the newsletter.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className="border-b border-border/30 transition-colors hover:bg-muted/10"
                                    >
                                        <td className="px-6 py-4 font-medium">{sub.email}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={sub.active ? "default" : "secondary"}
                                                className="rounded-full text-xs"
                                            >
                                                {sub.active ? "Active" : "Inactive"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(sub.subscribedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
