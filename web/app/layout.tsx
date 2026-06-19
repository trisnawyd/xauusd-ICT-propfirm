import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { NavSidebar, BottomNav } from "@/components/nav-sidebar";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XAU/USD ICT Desk",
  description: "Live ICT/SMC trade analysis dashboard for XAU/USD",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:px-6">
          {/* Desktop sidebar */}
          <aside className="hidden w-full shrink-0 md:block md:w-52">
            <div className="md:sticky md:top-6">
              <Link href="/" className="mb-4 block md:mb-6">
                <div className="text-lg font-bold tracking-tight">XAU/USD</div>
                <div className="text-xs text-muted-foreground">ICT / SMC Desk</div>
              </Link>
              <NavSidebar />
            </div>
          </aside>
          {/* Mobile header */}
          <Link href="/" className="block md:hidden">
            <div className="text-lg font-bold tracking-tight">XAU/USD</div>
            <div className="text-xs text-muted-foreground">ICT / SMC Desk</div>
          </Link>
          <main className="min-w-0 flex-1 pb-20 md:pb-0">{children}</main>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
