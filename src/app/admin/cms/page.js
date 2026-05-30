import { prisma } from "@/lib/prisma";
import CmsClient from "./CmsClient";

export const metadata = {
  title: "CMS Pages | Admin Dashboard",
};

export default async function CmsPages() {
  let initialData = {
    privacypolicy: "",
    termscondition: "",
    refundpolicy: "",
    aboutus: "",
  };
  let error = null;

  try {
    const [privacyPolicy, terms, refundPolicy, about] = await Promise.all([
      prisma.privacypolicy.findFirst(),
      prisma.terms.findFirst(),
      prisma.refundpolicy.findFirst(),
      prisma.about.findFirst(),
    ]);

    initialData = {
      privacypolicy: privacyPolicy?.privacypolicy_content || "",
      termscondition: terms?.termscondition_content || "",
      refundpolicy: refundPolicy?.refundpolicy_content || "",
      aboutus: about?.about_content || "",
    };
  } catch (err) {
    console.error("Error fetching CMS pages:", err);
    error = "Failed to load CMS content.";
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          CMS Pages
        </h1>
        <p className="text-gray-400 text-sm">
          Manage Privacy Policy, Terms & Conditions, Refund Policy, and About Us.
        </p>
      </div>

      <CmsClient initialData={initialData} error={error} />
    </div>
  );
}
