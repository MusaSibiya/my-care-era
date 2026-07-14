import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";
import Providers from "@/components/providers";
import PageBackground from "@/components/page-background";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "My Care-era - Find Your Path",
    template: "%s | My Care-era",
  },
  description:
    "Helping South African students find the best courses, careers, and university experiences. Upload your results and get personalized recommendations.",
  keywords: [
    "university",
    "courses",
    "careers",
    "South Africa",
    "NSC results",
    "matric",
    "NSFAS",
    "TVET",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        <Providers session={session}>
          <PageBackground>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </PageBackground>
        </Providers>
      </body>
    </html>
  );
}
