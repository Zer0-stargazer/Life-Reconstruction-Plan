import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeProvider } from"@/components/layout/theme-provider";
import { ModuleVisitTracker } from "@/components/layout/module-visit-tracker";
import { HeroAtlas } from "@/components/home/hero-atlas";
import { ModuleNextNav } from "@/components/shared/module-next-nav";
import { AuthProvider } from "@/contexts/auth-context";
import { UnlockDialog } from "@/components/auth/unlock-dialog";
import { SmoothScroll } from "@/components/shared/smooth-scroll";

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "600", "700"],
  preload: false,
  variable: "--font-noto-serif-sc",
});

export const metadata: Metadata = {
  title: {
    default: "人生重构计划",
    template: "%s | 人生重构计划",
  },
  description:
    "基于AI的人生规划与决策辅助工具。从姓名、职业、规律、窗口、努力、运气、命运七大维度重构你的未来。",
  keywords: [
    "人生规划",
    "命运",
    "职业选择",
    "决策",
    "AI",
    "概率分析",
    "人生",
  ],
  authors: [{ name: "Life Reboot" }],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "人生重构计划",
    title: "人生重构计划 · 不是算命，是算概率",
    description:
      "七个模块 + 一条时间轴，用数据、概率和规则重新整理你手里的牌。",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "人生重构计划 · 命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "人生重构计划 · 不是算命，是算概率",
    description:
      "七个模块 + 一条时间轴，用数据、概率和规则重新整理你手里的牌。",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#b2392b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="zh-CN" className={notoSerifSC.variable} suppressHydrationWarning>
      <body className="antialiased">
        {isDev && (
          <div data-dev-inspector />
        )}
        <ThemeProvider>
        <SmoothScroll />
        <AuthProvider>
          <UnlockDialog />
          <div className="flex min-h-screen">
            <div
              aria-hidden
              className="pointer-events-none fixed -bottom-[22vh] -right-[18vw] z-0 hidden aspect-square w-[min(72vw,1000px)] opacity-[0.06] md:block"
            >
              <HeroAtlas animated={false} withSeal={false} />
            </div>
            <ModuleVisitTracker />
            <AppSidebar />
            {/* pt-12 给移动端固定顶栏让位（顶栏 h-12，md 起隐藏），否则每页前 48px 被盖住 */}
            <main className="flex-1 min-w-0 pt-12 md:pt-0 md:ml-56">
              {children}
              <ModuleNextNav />
            </main>
          </div>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}