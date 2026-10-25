import type { Metadata } from "next";
import { Gloock, Nunito_Sans, Kalam } from "next/font/google";
import { Nav } from "@/components/Nav";
import "./globals.css";

const gloock = Gloock({
  variable: "--font-gloock",
  subsets: ["latin"],
  weight: "400",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Santosh — Meals from the Valley",
  description:
    "A Kashmiri Pandit home supper club: discover the food, cook it virtually, book a seat to taste it.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${gloock.variable} ${nunitoSans.variable} ${kalam.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-rice text-ink">
        <Nav />
        {children}
      </body>
    </html>
  );
}
