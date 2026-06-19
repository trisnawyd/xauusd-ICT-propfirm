"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, Activity, Newspaper, ScrollText, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLink = { href: string; label: string; icon: LucideIcon; exact?: boolean };

const LINKS: NavLink[] = [
  { href: "/", label: "Context", icon: Home, exact: true },
  { href: "/htf", label: "HTF Bias", icon: TrendingUp },
  { href: "/ltf", label: "LTF Analysis", icon: Activity },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/trade-log", label: "Trade Log", icon: ScrollText },
];

/** Fixed bottom tab bar for mobile only (md:hidden). Desktop uses AppSidebar. */
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {LINKS.map((l) => {
          const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
          const Icon = l.icon;
          return (
            <li key={l.href} className="flex-1">
              <Link
                href={l.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="leading-none">{l.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
