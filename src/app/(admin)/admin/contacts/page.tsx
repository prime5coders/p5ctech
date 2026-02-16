// ===========================================
// Admin - Contacts Page
// Table listing all contact form submissions
// ===========================================

"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface Contact {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export default function AdminContactsPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchContacts() {
            try {
                const res = await fetch("/api/admin/contacts");
                const data = await res.json();
                setContacts(data.contacts || []);
            } catch (error) {
                console.error("Failed to fetch contacts:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchContacts();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Contact Submissions</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    All messages received through the contact form.
                </p>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border/50 bg-card/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border/50 bg-muted/30">
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Subject
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                // Loading skeleton rows
                                Array.from({ length: 3 }).map((_, i) => (
                                    <tr key={i} className="border-b border-border/30">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <td key={j} className="px-6 py-4">
                                                <span className="inline-block h-4 w-24 animate-pulse rounded bg-muted" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : contacts.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-12 text-center text-muted-foreground"
                                    >
                                        No contact submissions yet. They&apos;ll appear here once
                                        someone fills out the contact form.
                                    </td>
                                </tr>
                            ) : (
                                contacts.map((contact) => (
                                    <tr
                                        key={contact.id}
                                        className="border-b border-border/30 transition-colors hover:bg-muted/10"
                                    >
                                        <td className="px-6 py-4 font-medium">{contact.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {contact.email}
                                        </td>
                                        <td className="px-6 py-4">{contact.subject}</td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant={contact.read ? "secondary" : "default"}
                                                className="rounded-full text-xs"
                                            >
                                                {contact.read ? "Read" : "New"}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {new Date(contact.createdAt).toLocaleDateString()}
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
