import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import BadgeIcon from "@mui/icons-material/Badge";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CategoryIcon from "@mui/icons-material/Category";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Roles } from "@/app/_types/RoleType";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BackHandIcon from "@mui/icons-material/BackHand";
import MoneyIcon from "@mui/icons-material/Money";
import GroupIcon from '@mui/icons-material/Group';
import PolicyIcon from '@mui/icons-material/Policy';

export type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type SidebarGroup = {
  title: string;
  items: SidebarItem[];
  allowFor?: string[];
};

export const sidebarGroups: SidebarGroup[] = [
  {
    title: "Requests",
    items: [
      {
        label: "Workflow Requests",
        href: "/requests/workflow",
        icon: <BackHandIcon />,
      },
    ],
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "Invoice",
    items: [
      {
        label: "Add Invoice",
        href: "/invoice/create",
        icon: <ReceiptLongIcon />,
      },
      { label: "Invoices", href: "/invoice/list", icon: <InventoryIcon /> },
    ],
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "Inventory",
    items: [
      { label: "Inventory", href: "/inventory", icon: <WarehouseIcon /> },
    ],
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "Production",
    items: [
      { label: "Create Batch", href: "/batch/create", icon: <LayersIcon /> },
      { label: "View Batches", href: "/batch/list", icon: <DynamicFeedIcon /> },
      // { label: 'Assign Batch', href: '/batch/assign', icon: <AssignmentAddIcon /> },
    ],
    allowFor: [Roles.PRODUCTION_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "Jobwork",
    items: [
      {
        label: "View Jobworks",
        href: "/jobwork/list",
        icon: <AssignmentIcon />,
      },
      {
        label: "In Pass",
        href: "/jobwork/inpass",
        icon: <AssignmentTurnedInIcon />,
      },
      { label: "Out Pass", href: "/batch/assign", icon: <AssignmentAddIcon /> },
    ],
    allowFor: [Roles.PRODUCTION_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "Payday",
    items: [{ label: "Payday Summary", href: "/payday", icon: <MoneyIcon /> }],
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.PRODUCTION_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "User Management",
    items: [{ label: "Users", href: "/users", icon: <GroupIcon /> }],
    allowFor: [Roles.SUPER_ADMIN],
  },
  {
    title: "Masters",
    items: [
      { label: "Suppliers", href: "/supplier", icon: <PeopleIcon /> },
      { label: "Transports", href: "/transport", icon: <LocalShippingIcon /> },
      { label: "Employees", href: "/employee", icon: <BadgeIcon /> },
      { label: "Items", href: "/item", icon: <ViewModuleIcon /> },
      { label: "Categories", href: "/category", icon: <CategoryIcon /> },
      {
        label: "Sub Categories",
        href: "/subcategory",
        icon: <AccountTreeIcon />,
      },
      { label: "Skills", href: "/skill", icon: <PsychologyIcon /> },
    ],
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.PRODUCTION_ADMIN, Roles.SUPER_ADMIN],
  },
  {
    title: "Dcouments",
    items: [
      { label: "Rules & Policies", href: "/rules", icon: <PolicyIcon /> },
    ],
    allowFor: [Roles.ACCOUNT_ADMIN, Roles.PRODUCTION_ADMIN, Roles.SUPER_ADMIN],
  },
];
