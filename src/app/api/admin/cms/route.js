import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const [privacyPolicy, terms, refundPolicy, about] = await Promise.all([
      prisma.privacypolicy.findFirst(),
      prisma.terms.findFirst(),
      prisma.refundpolicy.findFirst(),
      prisma.about.findFirst(),
    ]);

    return NextResponse.json({
      status: 1,
      data: {
        privacypolicy: privacyPolicy?.privacypolicy_content || "",
        termscondition: terms?.termscondition_content || "",
        refundpolicy: refundPolicy?.refundpolicy_content || "",
        aboutus: about?.about_content || "",
      },
    });
  } catch (error) {
    console.error("CMS GET Error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to fetch CMS content" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { type, content } = body;

    if (!type || !content) {
      return NextResponse.json(
        { status: 0, error: "Missing type or content" },
        { status: 400 }
      );
    }

    if (type === "privacypolicy") {
      const existing = await prisma.privacypolicy.findFirst();
      if (existing) {
        await prisma.privacypolicy.update({
          where: { id: existing.id },
          data: { privacypolicy_content: content },
        });
      } else {
        await prisma.privacypolicy.create({
          data: { privacypolicy_content: content },
        });
      }
    } else if (type === "termscondition") {
      const existing = await prisma.terms.findFirst();
      if (existing) {
        await prisma.terms.update({
          where: { id: existing.id },
          data: { termscondition_content: content },
        });
      } else {
        await prisma.terms.create({
          data: { termscondition_content: content },
        });
      }
    } else if (type === "refundpolicy") {
      const existing = await prisma.refundpolicy.findFirst();
      if (existing) {
        await prisma.refundpolicy.update({
          where: { id: existing.id },
          data: { refundpolicy_content: content },
        });
      } else {
        await prisma.refundpolicy.create({
          data: { refundpolicy_content: content },
        });
      }
    } else if (type === "aboutus") {
      const existing = await prisma.about.findFirst();
      if (existing) {
        await prisma.about.update({
          where: { id: existing.id },
          data: { about_content: content },
        });
      } else {
        await prisma.about.create({
          data: { about_content: content },
        });
      }
    } else {
      return NextResponse.json(
        { status: 0, error: "Invalid CMS type" },
        { status: 400 }
      );
    }

    return NextResponse.json({ status: 1, message: "Updated successfully" });
  } catch (error) {
    console.error("CMS PUT Error:", error);
    return NextResponse.json(
      { status: 0, error: "Failed to update CMS content" },
      { status: 500 }
    );
  }
}
