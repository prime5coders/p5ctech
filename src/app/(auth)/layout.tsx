// ===========================================
// Auth Layout
// Minimal layout for login/auth pages —
// no Navbar or Footer, standalone experience
// ===========================================

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
