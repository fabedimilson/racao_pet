import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ração do Meu Pet - Prefeitura de Manaus",
  description: "Programa oficial da Prefeitura de Manaus para garantir nutrição e bem-estar para cães e gatos de famílias de baixa renda.",
  openGraph: {
    title: "Ração do Meu Pet - Prefeitura de Manaus",
    description: "Inscreva seus pets e acompanhe seu processo no programa de ração gratuita da cidade de Manaus.",
    url: "https://racao-pet.vercel.app",
    siteName: "Ração do Meu Pet",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ração do Meu Pet - Prefeitura de Manaus",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ração do Meu Pet - Prefeitura de Manaus",
    description: "Programa oficial de nutrição animal para tutores de baixa renda em Manaus.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
