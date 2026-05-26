import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ error: 'Code and subtotal are required.' }, { status: 400 });
    }

    // Find the promo code
    const promo = await prisma.promocode.findFirst({
      where: { 
        offer_code: code,
        is_deleted: 2,
        is_available: 1
      }
    });

    if (!promo) {
      return NextResponse.json({ error: 'Invalid or expired promo code.' }, { status: 404 });
    }

    // Check dates (start_date and expire_date are strings in DB, e.g. "2024-12-31")
    const now = new Date();
    const startDate = promo.start_date ? new Date(promo.start_date) : null;
    const expireDate = promo.expire_date ? new Date(promo.expire_date) : null;

    if (startDate && startDate > now) {
      return NextResponse.json({ error: 'This promo code is not yet active.' }, { status: 400 });
    }
    
    // Add 1 day to expireDate to include the whole expiration day
    if (expireDate) {
      const expirationEnd = new Date(expireDate);
      expirationEnd.setHours(23, 59, 59, 999);
      if (now > expirationEnd) {
        return NextResponse.json({ error: 'This promo code has expired.' }, { status: 400 });
      }
    }

    // Check minimum amount
    if (promo.min_amount && subtotal < promo.min_amount) {
      return NextResponse.json({ error: `Minimum order amount of $${promo.min_amount} required.` }, { status: 400 });
    }

    // Calculate discount
    let discountAmount = 0;
    const offerAmount = parseFloat(promo.offer_amount);

    if (promo.offer_type === 1) {
      // Percentage
      discountAmount = (subtotal * offerAmount) / 100;
    } else {
      // Flat amount
      discountAmount = offerAmount;
    }

    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return NextResponse.json({ 
      success: true, 
      discountAmount: discountAmount.toFixed(2),
      promoCode: promo.offer_code,
      message: 'Promo code applied successfully!'
    });

  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
