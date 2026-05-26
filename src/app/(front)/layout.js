import Navbar from "@/components/front/Navbar";
import Footer from "@/components/front/Footer";
import SidebarCart from "@/components/front/SidebarCart";
import prisma from "@/lib/prisma";

export default async function FrontLayout({ children }) {
  const settings = await prisma.settings.findFirst();
  const cartStyle = settings?.cart_style || "sidebar";
  const showSidebarCart = cartStyle !== "page";

  const primaryColor = settings?.web_primary_color || "#e7272d";
  const secondaryColor = settings?.web_secondary_color || "#333333";
  const logo = settings?.logo || null;

  return (
    <div 
      className="flex flex-col min-h-screen bg-[#0a0a0a] text-white"
      style={{
        "--primary-color": primaryColor,
        "--secondary-color": secondaryColor
      }}
    >
      <Navbar cartStyle={cartStyle} logo={logo} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      {showSidebarCart && <SidebarCart />}
    </div>
  );
}
