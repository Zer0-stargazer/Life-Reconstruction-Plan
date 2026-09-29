import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ThemeProvider } from"@/components/layout/theme-provider";
import { ModuleVisitTracker } from "@/components/layout/module-visit-tracker";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: {
    default: "人生重构计划 | LIFE REBOOT",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <html lang="zh-CN" className="scroll-smooth" data-scroll-behavior="smooth">
      <body className="antialiased">
        {isDev && (
          <div data-dev-inspector />
        )}
        <ThemeProvider>
        <AuthProvider>
          <div className="flex min-h-screen">
            <ModuleVisitTracker />
            <AppSidebar />
            <main className="flex-1 md:ml-56">
              {children}
            </main>
          </div>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}