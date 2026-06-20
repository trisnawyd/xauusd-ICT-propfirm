import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { AppSidebar, type SidebarNavData } from "@/components/app-sidebar";
import { BottomNav } from "@/components/nav-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getHTFList, getLTFList, getNewsList, getTradeLogList } from "@/lib/content";
import { formatDate, timeFromSlug } from "@/lib/format";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XAU/USD ICT Desk",
  description: "Live ICT/SMC trade analysis dashboard for XAU/USD",
};

const RECENT = 6;

/** Build the recent-entry submenus once at build time (all reads are SSG). */
function buildNav(): SidebarNavData {
  return {
    htf: getHTFList()
      .slice(0, RECENT)
      .map((e) => ({ href: `/htf/${e.date}`, label: formatDate(e.date) })),
    ltf: getLTFList()
      .slice(0, RECENT)
      .map((e) => ({
        href: `/ltf/${e.date}/${e.slug}`,
        label: `${e.date.slice(6, 8)}-${e.date.slice(4, 6)} · ${timeFromSlug(e.slug)}`,
        direction: e.direction,
      })),
    news: getNewsList()
      .slice(0, RECENT)
      .map((e) => ({
        href: `/news/${e.slug.join("/")}`,
        label: e.event ? `${e.date.slice(4)} · ${e.event}` : e.slug.join("/"),
      })),
    tradeLog: getTradeLogList()
      .slice(0, RECENT)
      .map((e) => ({ href: `/trade-log/${e.date}`, label: formatDate(e.date) })),
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const nav = buildNav();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar nav={nav} />
            <SidebarInset>
              <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="hidden md:flex" />
                <Link href="/" className="font-bold tracking-tight md:hidden">
                  XAU/USD
                  <span className="ml-2 text-xs font-normal text-muted-foreground">ICT / SMC Desk</span>
                </Link>
                <div className="ml-auto">
                  <ThemeToggle />
                </div>
              </header>
              <main className="min-w-0 w-full flex-1 px-4 py-6 pb-24 md:px-6 md:pb-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
