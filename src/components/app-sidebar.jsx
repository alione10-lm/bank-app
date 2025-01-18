import * as React from "react";
import {
  ArrowLeftRight,
  ChartCandlestick,
  HandCoins,
  History,
  Wallet,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "My wallet",
      icon: Wallet,
      to: "wallet",
    },

    {
      title: "Transactions",
      icon: ArrowLeftRight,
      isActive: true,
      items: [
        {
          title: "sent",
          url: "sent",
        },
        {
          title: "deposit",
          url: "deposit",
        },
        {
          title: "withdraw",
          url: "withdraw",
        },
        {
          title: "request loan",
          url: "request-loan",
        },
      ],
    },

    {
      title: "Statistics",
      icon: ChartCandlestick,
      to: "statistics",
    },
    {
      title: "History",
      icon: History,
      to: "history",
    },
  ],
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <NavLink to="/">logo</NavLink>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
