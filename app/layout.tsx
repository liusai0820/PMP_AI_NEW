import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PMP.AI - 项目管理智能助手",
  description: "项目管理专业知识与智能辅助工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
