import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentAddIcon from "@mui/icons-material/AssignmentAdd";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

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
      // { label: "Create Batch", href: "/batch/create", icon: <LayersIcon /> },
      { label: "In Pass", href: "/jobwork/inpass", icon: <AssignmentTurnedInIcon /> },
      // { label: 'Assign Batch', href: '/batch/assign', icon: <AssignmentAddIcon /> },
    ],
  },
  {
    title: 'Masters',
    items: [
      { label: 'Suppliers', href: '/supplier', icon: <PeopleIcon /> },
      { label: 'Transports', href: '/transport', icon: <LocalShippingIcon /> },
    ],
  },
];
