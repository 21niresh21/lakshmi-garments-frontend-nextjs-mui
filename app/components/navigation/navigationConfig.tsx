import {
  Dashboard as DashboardIcon,
  ReceiptLong as ReceiptLongIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
  Layers as LayersIcon,
  AssignmentAdd as AssignmentAddIcon,
  DynamicFeed as DynamicFeedIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Badge as BadgeIcon,
  ViewModule as ViewModuleIcon,
  Category as CategoryIcon,
  AccountTree as AccountTreeIcon,
  Psychology as PsychologyIcon,
  Assignment as AssignmentIcon,
  Warehouse as WarehouseIcon,
  BackHand as BackHandIcon,
  Money as MoneyIcon,
  Group as GroupIcon,
  Policy as PolicyIcon,
  ListAlt as ListAltIcon,
  Visibility as VisibilityIcon,
  Palette as PaletteIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { Roles } from "@/app/_types/RoleType";
import React, { ReactNode } from "react";

export type NavItem = {
  label: string;
  href?: string;
  icon: ReactNode;
  children?: NavItem[];
  breadcrumbLabel?: string; // Optional: Override breadcrumb name if different from label
  allowFor?: string[]; // Roles allowed to see this specific item
  hideInSidebar?: boolean; // 👈 Add this to hide from sidebar but keep for breadcrumbs/auth
};

export type NavGroup = {
  title: string;
  items: NavItem[];
  allowFor?: string[]; // Roles allowed to see this entire group
};

export const navigationConfig: NavGroup[] = [
  // {
  //   title: "Overview",
  //   allowFor: [],
  //   items: [
  //     {
  //       label: "Dashboard",
  //       href: "/dashboard",
  //       icon: <DashboardIcon fontSize="small" />,
  //     },
  //   ],
  // },
  // {
  //   title: "Requests",
  //   allowFor: [],
  //   items: [
  //     {
  //       label: "Workflow Requests",
  //       href: "/requests/workflow",
  //       icon: <BackHandIcon fontSize="small" />,
  //     },
  //   ],
  // },
  {
    title: "Invoice",
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.SUPER_ADMIN],
    items: [
      {
        label: "Invoice Management",
        href: "/invoices", // 👈 This maps any /invoices/... URL to this parent
        icon: <ReceiptLongIcon fontSize="small" />,
        breadcrumbLabel: "Invoices",
        children: [
          {
            label: "Add Invoice",
            href: "/invoices/create",
            icon: <AssignmentAddIcon fontSize="small" />,
          },
          {
            label: "All Invoices",
            href: "/invoices/list",
            icon: <ListAltIcon fontSize="small" />,
          },
          {
            label: "Invoice Details",
            href: "/invoices/:id", // 👈 This pattern matches /invoices/ANYTHING
            icon: <VisibilityIcon fontSize="small" />,
            hideInSidebar: true, // 👈 Hide from sidebar navigation
          },
        ],
      },
    ],
  },
  {
    title: "Inventory",
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.SUPER_ADMIN],
    items: [
      {
        label: "Inventory",
        href: "/inventory",
        icon: <WarehouseIcon fontSize="small" />,
      },
    ],
  },
  // {
  //   title: "Production",
  //   allowFor: [],
  //   items: [
  //     {
  //       label: "Production",
  //       icon: <LayersIcon fontSize="small" />,
  //       children: [
  //         {
  //           label: "Create Batch",
  //           href: "/batch/create",
  //           icon: <AssignmentAddIcon fontSize="small" />,
  //         },
  //         {
  //           label: "View Batches",
  //           href: "/batch/list",
  //           icon: <DynamicFeedIcon fontSize="small" />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Jobwork",
  //   allowFor: [],
  //   items: [
  //     {
  //       label: "Jobwork",
  //       icon: <AssignmentIcon fontSize="small" />,
  //       children: [
  //         {
  //           label: "View Jobworks",
  //           href: "/jobwork/list",
  //           icon: <AssignmentIcon fontSize="small" />,
  //         },
  //         {
  //           label: "In Pass",
  //           href: "/jobwork/inpass",
  //           icon: <AssignmentTurnedInIcon fontSize="small" />,
  //         },
  //         {
  //           label: "Out Pass",
  //           href: "/batch/assign",
  //           icon: <AssignmentAddIcon fontSize="small" />,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "Finance",
  //   allowFor: [],
  //   items: [
  //     {
  //       label: "Payday Summary",
  //       href: "/payday",
  //       icon: <MoneyIcon fontSize="small" />,
  //     },
  //   ],
  // },
  {
    title: "User Management",
    allowFor: [Roles.SUPER_ADMIN],
    items: [
      {
        label: "Users",
        href: "/users",
        icon: <GroupIcon fontSize="small" />,
      },
    ],
  },
  {
    title: "Masters",
    allowFor: [Roles.SUPER_ADMIN, Roles.ACCOUNT_ADMIN, Roles.PRODUCTION_ADMIN],
    items: [
      {
        label: "Masters",
        icon: <ViewModuleIcon fontSize="small" />,
        children: [
          {
            label: "Suppliers",
            href: "/supplier",
            icon: <PeopleIcon fontSize="small" />,
            allowFor: [Roles.SUPER_ADMIN, Roles.ACCOUNT_ADMIN],
          },
          {
            label: "Transports",
            href: "/transport",
            icon: <LocalShippingIcon fontSize="small" />,
            allowFor: [Roles.SUPER_ADMIN, Roles.ACCOUNT_ADMIN],
          },
          {
            label: "Employees",
            href: "/employee",
            icon: <BadgeIcon fontSize="small" />,
          },
          {
            label: "Items",
            href: "/item",
            icon: <ViewModuleIcon fontSize="small" />,
          },
          {
            label: "Categories",
            href: "/category",
            icon: <CategoryIcon fontSize="small" />,
          },
          {
            label: "Sub Categories",
            href: "/subcategory",
            icon: <AccountTreeIcon fontSize="small" />,
          },
          {
            label: "Skills",
            href: "/skill",
            icon: <PsychologyIcon fontSize="small" />,
          },
        ],
      },
    ],
  },
  // {
  //   title: "Documents",
  //   allowFor: [],
  //   items: [
  //     {
  //       label: "Rules & Policies",
  //       href: "/rules",
  //       icon: <PolicyIcon fontSize="small" />,
  //     },
  //   ],
  // },
  {
    title: "Settings",
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.PRODUCTION_ADMIN, Roles.SUPER_ADMIN],
    items: [
      {
        label: "Theme Customization",
        href: "/settings/customize",
        icon: <PaletteIcon fontSize="small" />,
        hideInSidebar: true,
      },
      {
        label: "My Profile",
        href: "/profile",
        icon: <SettingsIcon fontSize="small" />,
        hideInSidebar: true,
      },
    ],
  },
];

/**
 * Utility to flatten grouped nav for breadcrumb searching
 */
export const allNavItems: NavItem[] = navigationConfig.flatMap(
  (group) => group.items,
);
