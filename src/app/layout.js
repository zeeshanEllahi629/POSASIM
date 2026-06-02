import { Inter } from "next/font/google";
import "./globals.css";
import AiChatWidget from "@/components/front/AiChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Foodefy - Complete POS & Website",
  description: "Next-gen POS system and website platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={`${inter.className} bg-[#050505] text-white min-h-screen`}>
        {children}
        <AiChatWidget />
      </body>
    </html>
  );
}
