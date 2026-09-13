import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobTracker",
  description: "Suivi de candidatures full-stack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}