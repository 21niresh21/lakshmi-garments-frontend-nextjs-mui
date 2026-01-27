"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { navigationConfig, NavItem, NavGroup } from "../components/navigation/navigationConfig";

/**
 * Checks if a URL matches a pattern (handling :dynamic-segments)
 */
function isPathMatch(pattern: string, actualPath: string): boolean {
    const patternParts = pattern.split("/").filter(Boolean);
    const pathParts = actualPath.split("/").filter(Boolean);

    if (patternParts.length !== pathParts.length) return false;

    return patternParts.every((part, i) => {
        return part.startsWith(":") || part === pathParts[i];
    });
}

function findAuthorizedRoles(pathname: string): string[] | null {
    for (const group of navigationConfig) {
        for (const item of group.items) {
            // Check parent item
            if (item.href && (item.href === pathname || isPathMatch(item.href, pathname))) {
                return item.allowFor || group.allowFor || null;
            }

            // Check children
            if (item.children) {
                for (const child of item.children) {
                    if (child.href && (child.href === pathname || isPathMatch(child.href, pathname))) {
                        return child.allowFor || item.allowFor || group.allowFor || null;
                    }
                }
            }
        }
    }
    return null; // Public if not found in config
}

export function useAuthorization() {
    const { user } = useUser();
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        if (!user) {
            setIsAuthorized(null);
            return;
        }

        const authorizedRoles = findAuthorizedRoles(pathname);

        // If route isn't restricted in config, it's open to all authenticated users
        if (!authorizedRoles) {
            setIsAuthorized(true);
            return;
        }

        const userRole = user.roles[0];
        const hasAccess = authorizedRoles.includes(userRole);

        setIsAuthorized(hasAccess);

        if (!hasAccess) {
            // Redirect to a safe page if not authorized
            // We use profile as it's accessible to everyone
            router.replace("/profile");
        }
    }, [pathname, user, router]);

    return { isAuthorized };
}
