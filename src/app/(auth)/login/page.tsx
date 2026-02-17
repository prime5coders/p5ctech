import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginPage from "./login-form";

export default async function LoginPageWrapper() {
    const session = await auth();

    if (session) {
        redirect("/admin");
    }

    return <LoginPage />;
}
