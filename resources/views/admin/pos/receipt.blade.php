<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receipt - {{ $order->order_number ?? '' }}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; font-size: 12px; width: 80mm; margin: 0 auto; padding: 5mm; color: #000; background: #fff; }
        .receipt-header { text-align: center; margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
        .receipt-header h2 { font-size: 16px; margin-bottom: 3px; }
        .receipt-header p { font-size: 11px; line-height: 1.4; }
        .receipt-info { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 8px; font-size: 11px; }
        .receipt-info .info-row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .receipt-items { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 8px; }
        .receipt-items .item-header { display: flex; justify-content: space-between; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 3px; margin-bottom: 5px; font-size: 11px; }
        .receipt-items .item-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 11px; }
        .receipt-items .item-name { flex: 1; }
        .receipt-items .item-qty { width: 30px; text-align: center; }
        .receipt-items .item-price { width: 60px; text-align: right; }
        .receipt-totals { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 8px; }
        .receipt-totals .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px; }
        .receipt-totals .grand-total { font-size: 16px; font-weight: bold; margin-top: 5px; padding-top: 5px; border-top: 1px solid #000; }
        .receipt-footer { text-align: center; font-size: 11px; margin-top: 10px; }
        .receipt-footer p { margin-bottom: 3px; }
        @media print {
            body { width: 80mm; }
            @page { size: 80mm auto; margin: 0; }
        }
    </style>
</head>
<body onload="window.print()">
    <div class="receipt-header">
        <h2>{{ @$settings->website_title ?? 'POS System' }}</h2>
        @if(@$settings->address)
        <p>{{ $settings->address }}</p>
        @endif
        @if(@$settings->contact)
        <p>Tel: {{ $settings->contact }}</p>
        @endif
    </div>

    <div class="receipt-info">
        <div class="info-row">
            <span>Order #:</span>
            <span>{{ $order->order_number ?? 'N/A' }}</span>
        </div>
        <div class="info-row">
            <span>Date:</span>
            <span>{{ $order->created_at ? $order->created_at->format('d/m/Y H:i') : '' }}</span>
        </div>
        @if($order->name)
        <div class="info-row">
            <span>Customer:</span>
            <span>{{ $order->name }}</span>
        </div>
        @endif
    </div>

    <div class="receipt-items">
        <div class="item-header">
            <span class="item-name">Item</span>
            <span class="item-qty">Qty</span>
            <span class="item-price">Total</span>
        </div>
        @foreach($orderDetails as $detail)
        <div class="item-row">
            <span class="item-name">{{ $detail->item_name ?? ($detail->item_info->item_name ?? 'Item') }}</span>
            <span class="item-qty">{{ $detail->qty }}</span>
            <span class="item-price">{{ @helper::currency_format($detail->item_price * $detail->qty) }}</span>
        </div>
        @endforeach
    </div>

    <div class="receipt-totals">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>{{ @helper::currency_format($order->order_total ?? $order->grand_total) }}</span>
        </div>
        @if($order->tax_amount > 0)
        <div class="total-row">
            <span>Tax:</span>
            <span>{{ @helper::currency_format($order->tax_amount) }}</span>
        </div>
        @endif
        @if($order->discount_amount > 0)
        <div class="total-row">
            <span>Discount:</span>
            <span>-{{ @helper::currency_format($order->discount_amount) }}</span>
        </div>
        @endif
        <div class="total-row grand-total">
            <span>TOTAL:</span>
            <span>{{ @helper::currency_format($order->grand_total) }}</span>
        </div>
    </div>

    <div class="receipt-footer">
        <p>Thank you for your purchase!</p>
        <p>{{ @$settings->website_title ?? '' }}</p>
    </div>
</body>
</html>
