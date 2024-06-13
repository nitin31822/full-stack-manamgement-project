import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
const inter = Inter({ subsets: ["latin"] });
import Container from "@/components/my-components/Container";

import QueryProvider from "@/context/QueryProvider";
import StoreProvider from "@/context/StoreProvider";
import { SocketProvider } from "./custom-Hooks/SocketProvider";

export const metadata: Metadata = {
  title: "AI-Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StoreProvider>
      <AuthProvider>
        <QueryProvider>
          <body className={inter.className}>
            <SocketProvider>
            <Container>
            
              {children}
              <Toaster />
            </Container>
            </SocketProvider>
          </body>
        </QueryProvider>
      </AuthProvider>
      </StoreProvider>
    </html>
  );
}
