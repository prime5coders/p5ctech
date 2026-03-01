import { auth } from "@/auth";
import LoginPage from "./login-form";

export default async function LoginPageWrapper() {
    const session = await auth();

    // Middleware handles auth redirection, but as a fallback/type safety
    // if accessed improperly, render nothing while middleware redirects
    if (session) {
        return null;
    }

    return <LoginPage />;
}
