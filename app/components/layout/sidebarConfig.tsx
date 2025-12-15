import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

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
    title: 'Invoice',
    items: [
      { label: 'Add Invoice', href: '/invoice/create', icon: <ReceiptLongIcon /> },
      { label: 'Invoices', href: '/invoice/list', icon: <InventoryIcon/> },
    ],
  },
  // {
  //   title: 'Masters',
  //   items: [
  //     { label: 'Suppliers', href: '/suppliers', icon: <PeopleIcon /> },
  //     { label: 'Transports', href: '/transports', icon: <LocalShippingIcon /> },
  //   ],
  // },
];
