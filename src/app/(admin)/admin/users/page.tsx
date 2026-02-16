// ===========================================
// Admin Users Page
// View all registered users with their
// details — passwords are never exposed
// ===========================================

"use client";

import { useEffect, useState } from "react";
import { Users, Shield, Calendar } from "lucide-react";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/users")
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Registered Users</h1>
                <p className="mt-1 text-muted-foreground">
                    All user accounts and their details
                </p>
            </div>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-border/50 bg-card/50 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                            <Users size={18} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{loading ? "—" : users.length}</p>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/50 p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/20">
                            <Shield size={18} className="text-chart-3" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">
                                {loading ? "—" : users.filter((u) => u.role === "admin").length}
                            </p>
                            <p className="text-sm text-muted-foreground">Admins</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-border/50 bg-card/50">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-border/50 bg-muted/30">
                            <th className="px-5 py-3 font-medium text-muted-foreground">Name</th>
                            <th className="px-5 py-3 font-medium text-muted-foreground">Email</th>
                            <th className="px-5 py-3 font-medium text-muted-foreground">Role</th>
                            <th className="px-5 py-3 font-medium text-muted-foreground">Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="border-b border-border/30">
                                    {Array.from({ length: 4 }).map((_, j) => (
                                        <td key={j} className="px-5 py-4">
                                            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-5 py-12 text-center text-muted-foreground">
                                    <Users size={32} className="mx-auto mb-2 opacity-40" />
                                    No users registered yet.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-border/30 transition-colors hover:bg-muted/20"
                                >
                                    <td className="px-5 py-4 font-medium">{user.name}</td>
                                    <td className="px-5 py-4 text-muted-foreground">{user.email}</td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-medium text-primary">
                                            <Shield size={10} />
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-muted-foreground">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Calendar size={12} />
                                            {new Date(user.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
