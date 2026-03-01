"use client";

import { logOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => logOut()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
            <LogOut size={18} />
            Sign out
        </button>
    );
}
