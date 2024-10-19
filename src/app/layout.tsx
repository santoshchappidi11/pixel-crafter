import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/Header";
import Provider from "./provider";
import { Toaster } from "@/components/ui/toaster";
import { Poppins } from "next/font/google";
import { PixelCrafterProvider } from "./context/PixelCrafterContext";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700"], // weights
  subsets: ["latin"],
  fallback: ["sans-serif"], // fallback font
  display: "swap", // This will make the font swap immediately when loaded
});

export const metadata: Metadata = {
  title: "PIXEL CRAFTER - Generate Images for free",
  description: "Generate Images for FREE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} dark:bg-gray-950 dark:text-white`}>
        <PixelCrafterProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Provider>
              <Header />
              {children}
              <Toaster />
            </Provider>
          </ThemeProvider>
        </PixelCrafterProvider>
      </body>
    </html>
  );
}
