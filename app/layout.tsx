import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Geist({ variable: "--sans", subsets: ["latin"] });
const mono = Geist_Mono({ variable: "--mono", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocol = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  return {
    metadataBase: new URL(`${protocol}://${host}`),
    title: "陈旖旎｜UI / 品牌设计师作品集",
    description: "陈旖旎的个人设计作品集，涵盖产品体验、界面设计、品牌营销与 B 端网页。",
    icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
    openGraph: {
      title: "CHENYNII — UI / BRAND DESIGNER",
      description: "Selected work in product experience, interface and brand design.",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "CHENYNII portfolio" }],
    },
    twitter: { card: "summary_large_image", title: "CHENYNII — UI / BRAND DESIGNER", images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body className={`${sans.variable} ${mono.variable}`}>{children}</body></html>;
}
