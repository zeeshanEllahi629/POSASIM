import fetch from 'node-fetch';
import prisma from '@/lib/prisma';

// Simple mockup for Email service based on the prompt
export const trackingEmailService = {
  async sendEmail(emailAddress, subject, message) {
    console.log(`Sending Email to ${emailAddress} | Subject: ${subject}\nMessage: ${message}`);
    // In reality, this would connect to an Email provider like SendGrid, SES, or NodeMailer
  },
  
  async sendTrackingUpdate(emailAddress, orderNumber, status, lastEvent, trackingNumber) {
    const statusMessages = {
      'in_transit':        '📦 Your order is on its way!',
      'out_for_delivery':  '🚚 Out for delivery today!',
      'delivered':         '✅ Your order has been delivered!',
      'exception':         '⚠️ There is an issue with your shipment.'
    };
    const subject = `Order ${orderNumber} Tracking Update`;
    const message = `
${statusMessages[status] || 'Your order status has been updated.'}

Order: ${orderNumber}
Status: ${status.replace(/_/g, ' ').toUpperCase()}
Update: ${lastEvent}

Track your package: https://t.17track.net/en#nums=${trackingNumber}
    `.trim();

    await this.sendEmail(emailAddress, subject, message);
  },

  async sendShippedNotification(emailAddress, orderNumber, trackingNumber) {
    const subject = `Your Order ${orderNumber} has been shipped!`;
    const message = `
📦 Great news! Your order ${orderNumber} has been shipped.

Tracking Number: ${trackingNumber}
Track here: https://t.17track.net/en#nums=${trackingNumber}

Estimated delivery: 7-20 business days (international shipping)
    `.trim();

    await this.sendEmail(emailAddress, subject, message);
  }
};

export class TrackingService {
  async registerTracking(trackingNumber, orderNo) {
    try {
      const response = await fetch('https://api.17track.net/track/v2.2/register', {
        method: 'POST',
        headers: {
          '17token': process.env.TRACK17_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{
          number: trackingNumber,
          orderNo: orderNo,
        }])
      });
      const data = await response.json();
      return data.code === 0 || (data.data?.accepted?.length > 0);
    } catch (e) {
      console.error('17TRACK register error:', e);
      return false;
    }
  }

  async getTrackingInfo(trackingNumber) {
    try {
      const response = await fetch('https://api.17track.net/track/v2.2/gettrackinfo', {
        method: 'POST',
        headers: {
          '17token': process.env.TRACK17_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ number: trackingNumber }])
      });
      const data = await response.json();
      const info = data.data?.accepted?.[0];
      return {
        status: info?.trackingStatus || 'pending',
        lastEvent: info?.lastTrackingInfo?.description || '',
        lastEventTime: info?.lastTrackingTime || '',
        estimatedDelivery: info?.scheduledDeliveryDate || null
      };
    } catch (e) {
      console.error('17TRACK info error:', e);
      return {
        status: 'pending',
        lastEvent: '',
        lastEventTime: '',
        estimatedDelivery: null
      };
    }
  }

  async handleWebhook(payload) {
    for (const item of payload.data?.accepted || []) {
      const trackingNumber = item.number;
      const newStatus = item.trackingStatus;

      const shipment = await prisma.shipment.findFirst({
        where: { trackingNumber },
        include: { purchaseOrder: { include: { order: true } } }
      });
      if (!shipment) continue;

      const statusMap = {
        '001': 'pending', '002': 'in_transit', '003': 'exception',
        '004': 'delivered', '005': 'exception', '006': 'exception',
        '007': 'exception', '008': 'out_for_delivery'
      };

      const ourStatus = statusMap[newStatus] || 'in_transit';
      const lastEvent = item.lastEvent?.description || '';

      await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          trackingStatus: ourStatus,
          transitStatus: newStatus,
          lastEvent,
          lastEventTime: item.lastTrackingTime ? new Date(item.lastTrackingTime) : null,
          deliveredAt: ourStatus === 'delivered' ? new Date() : undefined
        }
      });

      await prisma.purchaseOrder.update({
        where: { id: shipment.purchaseOrderId },
        data: {
          status: ourStatus === 'delivered' ? 'delivered' : 'shipped'
        }
      });

      if (ourStatus === 'delivered') {
        await prisma.order.update({
          where: { id: shipment.purchaseOrder.orderId },
          data: { status: 'delivered' }
        });
      }

      const customer = shipment.purchaseOrder.order;
      if (customer.email) {
        await trackingEmailService.sendTrackingUpdate(
          customer.email,
          customer.order_number,
          ourStatus,
          lastEvent,
          trackingNumber
        );
      }
    }
  }
}

export const trackingService = new TrackingService();
