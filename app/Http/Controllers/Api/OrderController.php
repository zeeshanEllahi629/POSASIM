<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function history(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->orderBy('id', 'desc')
            ->paginate(15);

        return response()->json([
            'status' => 1,
            'data' => $orders
        ]);
    }

    public function details($id)
    {
        $order = Order::with('details.item_info')->find($id);

        if (!$order) {
            return response()->json([
                'status' => 0,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'status' => 1,
            'data' => $order
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'subtotal' => 'required|numeric',
            'tax' => 'required|numeric',
            'grand_total' => 'required|numeric',
            'payment_method' => 'required|string',
            'branch_id' => 'nullable|exists:branches,id'
        ]);

        DB::beginTransaction();
        try {
            $order = new Order();
            $order->user_id = $request->user()->id;
            $order->order_number = strtoupper(uniqid('ORD-'));
            $order->subtotal = $request->subtotal;
            $order->tax = $request->tax;
            $order->grand_total = $request->grand_total;
            $order->status = 1; // Pending or placed
            $order->payment_type = $request->payment_method;
            $order->is_pos_order = $request->has('is_pos_order') ? 1 : 0;
            $order->branch_id = $request->branch_id;
            $order->date = date('Y-m-d');
            $order->save();

            foreach ($request->items as $item) {
                $detail = new OrderDetails();
                $detail->order_id = $order->id;
                $detail->item_id = $item['item_id'];
                $detail->price = $item['price'];
                $detail->qty = $item['qty'];
                $detail->item_notes = $item['notes'] ?? '';
                $detail->save();
            }

            DB::commit();

            return response()->json([
                'status' => 1,
                'message' => 'Order created successfully',
                'order_id' => $order->id,
                'order_number' => $order->order_number
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Error creating order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
