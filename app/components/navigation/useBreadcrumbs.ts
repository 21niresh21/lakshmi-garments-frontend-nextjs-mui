import { usePathname } from "next/navigation";
import { allNavItems, NavItem } from "./navigationConfig";

type Crumb = {
  label: string;
  icon?: React.ReactNode;
  href?: string;
};

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

/**
 * Searches for the best matching path, supporting dynamic patterns
 */
function findPath(
  items: NavItem[],
  pathname: string,
  parents: NavItem[] = []
): NavItem[] | null {
  for (const item of items) {
    const currentPath = [...parents, item];

    // 1. Precise Match (including patterns like /invoices/:id)
    if (item.href && isPathMatch(item.href, pathname)) {
      return currentPath;
    }

    // 2. Prefix Match (for parents)
    if (item.href && pathname.startsWith(item.href + "/")) {
      // Don't return yet, check children for a more specific dynamic match
      if (item.children) {
        const foundInChildren = findPath(item.children, pathname, currentPath);
        if (foundInChildren) return foundInChildren;
      }
      return currentPath;
    }

    // 3. Regular Recursive Search
    if (item.children) {
      const foundInChildren = findPath(item.children, pathname, currentPath);
      if (foundInChildren) return foundInChildren;
    }
  }

  return null;
}

export function useBreadcrumbs(): Crumb[] {
  const pathname = usePathname();
  const matchedNodes = findPath(allNavItems, pathname) ?? [];
  const pathParts = pathname.split("/").filter(Boolean);

  return matchedNodes.map((item) => {
    let label = item.breadcrumbLabel || item.label;

    // Logic to show the actual ID if desired:
    // If the matched href contains a ":id" and we are on a specific URL
    if (item.href?.includes(":")) {
      const hrefParts = item.href.split("/").filter(Boolean);
      const paramIndex = hrefParts.findIndex((part) => part.startsWith(":"));
      if (paramIndex !== -1 && pathParts[paramIndex]) {
        // Option A: Use the actual ID (e.g. INV-001)
        // label = pathParts[paramIndex]; 

        // Option B: Combine them (e.g. Invoice Details (INV-001))
        label = `${label} (${pathParts[paramIndex]})`;
      }
    }

    return {
      label,
      icon: item.icon,
      href: item.href?.includes(":") ? pathname : item.href, // Keep current URL for dynamic crumbs
    };
  });
}
