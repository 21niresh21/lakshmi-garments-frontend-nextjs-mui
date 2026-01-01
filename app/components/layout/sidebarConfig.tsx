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
import AssignmentIcon from '@mui/icons-material/Assignment';

export type SidebarItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

export type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

export const sidebarGroups: SidebarGroup[] = [
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
  },
  {
    title: "Production",
    items: [
      { label: "Create Batch", href: "/batch/create", icon: <LayersIcon /> },
      { label: "View Batches", href: "/batch/list", icon: <DynamicFeedIcon /> },
      // { label: 'Assign Batch', href: '/batch/assign', icon: <AssignmentAddIcon /> },
    ],
  },
  {
    title: "Jobwork",
    items: [
      { label: "View Jobworks", href: "/jobwork/list", icon: <AssignmentIcon /> },
      {
        label: "In Pass",
        href: "/jobwork/inpass",
        icon: <AssignmentTurnedInIcon />,
      },
      { label: "Out Pass", href: "/batch/assign", icon: <AssignmentAddIcon /> },
    ],
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
  },
];
