import { useRouter } from "next/navigation";

export function useAuthActions() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("session_expires_at");
        document.cookie =
            "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
        router.push("/login");
    };

    return { logout };
}
