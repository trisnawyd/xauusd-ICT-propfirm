"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Zap,
  Newspaper,
  ScrollText,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { DirectionBadge } from "@/components/direction-badge";
import type { Direction } from "@/lib/types";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type NavChild = { href: string; label: string; direction?: Direction };

/** Recent entries per section, built at build time in the server layout. */
export type SidebarNavData = {
  htf: NavChild[];
  ltf: NavChild[];
  scalp: NavChild[];
  news: NavChild[];
  tradeLog: NavChild[];
};

type SectionKey = keyof SidebarNavData;

const SECTIONS: { key: SectionKey; href: string; label: string; icon: LucideIcon }[] = [
  { key: "htf", href: "/htf", label: "HTF Bias", icon: TrendingUp },
  { key: "ltf", href: "/ltf", label: "LTF Analysis", icon: Activity },
  { key: "scalp", href: "/scalp", label: "Scalp", icon: Zap },
  { key: "news", href: "/news", label: "News", icon: Newspaper },
  { key: "tradeLog", href: "/trade-log", label: "Trade Log", icon: ScrollText },
];

export function AppSidebar({ nav }: { nav: SidebarNavData }) {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip="XAU/USD ICT Desk">
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary font-bold text-primary-foreground">
                    XU
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate text-sm font-semibold">XAU/USD</span>
                    <span className="truncate text-xs text-muted-foreground">ICT / SMC Desk</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              {/* Calendar & Dashboard — flat links, no submenu */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"} tooltip="Calendar">
                  <Link href="/">
                    <CalendarDays />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const children = nav[section.key];
                const sectionActive = pathname.startsWith(section.href);

                return (
                  <Collapsible
                    key={section.key}
                    asChild
                    defaultOpen={sectionActive}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={sectionActive} tooltip={section.label}>
                          <Icon />
                          <span>{section.label}</span>
                          <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {children.map((c) => (
                            <SidebarMenuSubItem key={c.href}>
                              <SidebarMenuSubButton asChild isActive={pathname === c.href}>
                                <Link href={c.href}>
                                  <span className="truncate font-mono text-xs">{c.label}</span>
                                  {c.direction && (
                                    <DirectionBadge direction={c.direction} className="ml-auto shrink-0" />
                                  )}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                          <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild className="text-primary">
                              <Link href={section.href}>View all →</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  );
}
