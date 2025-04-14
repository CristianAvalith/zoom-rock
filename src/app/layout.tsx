import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from "@/theme/ThemeRegistry";
import ColorModeProvider from "@/theme/ColorModeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RocksAI",
  description: "Frontend de RocksAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeRegistry>
          <ColorModeProvider>{children}</ColorModeProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
