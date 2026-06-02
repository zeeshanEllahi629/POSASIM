import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { trackingService, trackingEmailService } from '@/services/TrackingService';

export async function POST(req) {
  try {
    const body = await req.json();
    const { purchaseOrderId, trackingNumber, carrier } = body;

    if (!purchaseOrderId || !trackingNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderIdInt = parseInt(purchaseOrderId);

    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id: orderIdInt },
      include: { order: true }
    });

    if (!purchaseOrder) {
      return NextResponse.json({ error: 'Purchase Order not found' }, { status: 404 });
    }

    const shipment = await prisma.shipment.upsert({
      where: { purchaseOrderId: orderIdInt },
      update: { trackingNumber, carrier, shippedAt: new Date(), trackingStatus: 'in_transit' },
      create: {
        purchaseOrderId: orderIdInt,
        trackingNumber,
        carrier,
        shippedAt: new Date(),
        trackingStatus: 'in_transit'
      }
    });

    // Register with 17TRACK
    const orderNo = purchaseOrder.order.order_number;
    await trackingService.registerTracking(trackingNumber, orderNo);

    // Update Purchase Order Status
    await prisma.purchaseOrder.update({
      where: { id: orderIdInt },
      data: { status: 'shipped' }
    });

    // Send Email Notification
    if (purchaseOrder.order.email) {
      await trackingEmailService.sendShippedNotification(
        purchaseOrder.order.email,
        orderNo,
        trackingNumber
      );
    }

    return NextResponse.json({ success: true, shipment }, { status: 200 });
  } catch (error) {
    console.error('Tracking Error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
