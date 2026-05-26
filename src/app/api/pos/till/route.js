import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { parseJwt } from "@/middleware"; // Make sure to export parseJwt from middleware or re-implement it here if needed.
import { cookies } from "next/headers";

// Helper to get current user id from token
async function getUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return 1; // Fallback for dev
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    return payload.id || 1;
  } catch (e) {
    return 1;
  }
}

export async function GET() {
  try {
    const userId = await getUserId();
    const openTill = await prisma.till_sessions.findFirst({
      where: {
        user_id: parseInt(userId),
        status: "open",
      },
    });

    if (openTill) {
      // Calculate current sales for this session
      const orders = await prisma.order.findMany({
        where: {
          cashier_id: BigInt(userId),
          created_at: {
            gte: openTill.opened_at,
          },
          status: {
            in: ["1", "2", "3"]
          }
        },
      });

      let cashSales = 0;
      let cardSales = 0;

      orders.forEach(order => {
        const total = parseFloat(order.grand_total) || 0;
        const pType = order.transaction_type; // 1=Cash, 2=Card, 5=Split
        
        if (pType === "1") {
          cashSales += total;
        } else if (pType === "2") {
          cardSales += total;
        } else if (pType === "5") {
          // Parse split amount from admin_notes if possible
          // admin_notes: Split Payment: Cash $X, Card $Y
          try {
            const match = order.admin_notes.match(/Cash \$([\d.]+), Card \$([\d.]+)/);
            if (match) {
              cashSales += parseFloat(match[1]);
              cardSales += parseFloat(match[2]);
            }
          } catch(e) {}
        }
      });

      return NextResponse.json({ 
        status: 1, 
        is_open: true, 
        till: {
          ...openTill,
          opening_balance: parseFloat(openTill.opening_balance),
          current_cash: parseFloat(openTill.opening_balance) + cashSales,
          cash_sales: cashSales,
          card_sales: cardSales,
        }
      });
    } else {
      return NextResponse.json({ status: 1, is_open: false });
    }
  } catch (error) {
    console.error("Till GET Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to get till status" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { opening_balance } = await req.json();
    const userId = await getUserId();

    const newTill = await prisma.till_sessions.create({
      data: {
        user_id: parseInt(userId),
        opening_balance: parseFloat(opening_balance) || 0,
        status: "open",
      }
    });

    return NextResponse.json({ status: 1, message: "Till opened", till: newTill });
  } catch (error) {
    console.error("Till POST Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to open till" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, closing_balance, cash_sales, card_sales } = await req.json();
    
    await prisma.till_sessions.update({
      where: { id: parseInt(id) },
      data: {
        closing_balance: parseFloat(closing_balance) || 0,
        cash_sales: parseFloat(cash_sales) || 0,
        card_sales: parseFloat(card_sales) || 0,
        status: "closed",
        closed_at: new Date(),
      }
    });

    return NextResponse.json({ status: 1, message: "Till closed" });
  } catch (error) {
    console.error("Till PUT Error:", error);
    return NextResponse.json({ status: 0, error: "Failed to close till" }, { status: 500 });
  }
}
