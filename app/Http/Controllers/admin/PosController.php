<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Helpers\helper;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderDetails;
use App\Models\Tax;
use App\Models\User;
use App\Models\PosHeldCart;
use App\Models\Payment;
use App\Models\Variation;
use App\Models\Addons;
use App\Models\AddonsGroup;
use App\Models\Settings;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PosController extends Controller
{
    /**
     * Main POS screen
     */
    public function index()
    {
        $categories = Category::select('id', 'category_name', 'slug', 'image')
            ->where('is_available', 1)
            ->where('is_deleted', 2)
            ->orderBy('reorder_id')
            ->get();

        $items = Item::with('category_info', 'item_image')
            ->where('item_status', 1)
            ->where('is_deleted', 2)
            ->orderBy('id', 'DESC')
            ->get();

        $taxes = Tax::all();

        $payments = Payment::where('is_available', 1)
            ->where('is_activate', 1)
            ->orderBy('reorder_id')
            ->get();

        $heldCartsCount = PosHeldCart::where('status', 'held')->count();

        $settings = Settings::first();

        return view('admin.pos.index', compact(
            'categories',
            'items',
            'taxes',
            'payments',
            'heldCartsCount',
            'settings'
        ));
    }

    /**
     * AJAX: Search items by name or barcode
     */
    public function search(Request $request)
    {
        try {
            $query = $request->query('query', '');

            if (empty($query)) {
                return response()->json(['status' => 0, 'items' => []], 200);
            }

            $items = Item::with('category_info', 'item_image')
                ->where('item_status', 1)
                ->where('is_deleted', 2)
                ->where(function ($q) use ($query) {
                    $q->where('item_name', 'LIKE', '%' . $query . '%')
                      ->orWhere('slug', 'LIKE', '%' . $query . '%');
                })
                ->limit(20)
                ->get();

            return response()->json(['status' => 1, 'items' => $items], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 0, 'message' => 'Search failed: ' . $th->getMessage()], 500);
        }
    }

    /**
     * AJAX: Filter items by category
     */
    public function getItemsByCategory(Request $request)
    {
        try {
            $categoryId = $request->query('category_id');

            $query = Item::with('category_info', 'item_image')
                ->where('item_status', 1)
                ->where('is_deleted', 2);

            if ($categoryId && $categoryId !== 'all') {
                $query->where('cat_id', $categoryId);
            }

            $items = $query->orderBy('id', 'DESC')->get();

            return response()->json(['status' => 1, 'items' => $items], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 0, 'message' => 'Failed to load items: ' . $th->getMessage()], 500);
        }
    }

    /**
     * AJAX: Get single item with variations, extras, addons
     */
    public function getItemDetails(Request $request)
    {
        try {
            $itemId = $request->query('item_id');

            $item = Item::with('category_info', 'item_image', 'item_images', 'extras')
                ->where('id', $itemId)
                ->first();

            if (!$item) {
                return response()->json(['status' => 0, 'message' => 'Item not found'], 404);
            }

            // Load variations
            $variations = Variation::where('item_id', $itemId)->get();

            // Load addons if item has addons_id
            $addons = [];
            if (!empty($item->addons_id)) {
                $addonIds = explode(',', $item->addons_id);
                $addons = Addons::whereIn('id', $addonIds)->get();
            }

            return response()->json([
                'status' => 1,
                'item' => $item,
                'variations' => $variations,
                'addons' => $addons
            ], 200);
        } catch (\Throwable $th) {
            return response()->json(['status' => 0, 'message' => 'Failed to load item: ' . $th->getMessage()], 500);
        }
    }

    /**
     * Process POS sale / payment
     */
    public function processPayment(Request $request)
    {
        try {
            $data = $request->all();

            if (empty($data['items']) || count($data['items']) === 0) {
                return response()->json(['status' => 0, 'message' => 'Cart is empty'], 400);
            }

            DB::beginTransaction();

            // Generate order number using existing pattern
            $getordernumber = Order::select('order_number', 'order_number_digit', 'order_number_start')
                ->orderBy('id', 'DESC')
                ->first();

            if (empty($getordernumber->order_number_digit)) {
                $n = @helper::appdata()->order_number_start ?: 1000;
                $newbooking_number = str_pad($n, 0, STR_PAD_LEFT);
            } else {
                if ($getordernumber->order_number_start == @helper::appdata()->order_number_start) {
                    $n = (int)($getordernumber->order_number_digit);
                    $newbooking_number = str_pad($n + 1, 0, STR_PAD_LEFT);
                } else {
                    $n = @helper::appdata()->order_number_start ?: 1000;
                    $newbooking_number = str_pad($n, 0, STR_PAD_LEFT);
                }
            }

            $order_prefix = @helper::appdata()->order_prefix ?: 'ORD-';
            $order_number = $order_prefix . $newbooking_number;

            // Create Order
            $order = new Order();
            $order->order_number = $order_number;
            $order->order_number_digit = $newbooking_number;
            $order->order_number_start = @helper::appdata()->order_number_start;
            $order->user_id = $data['customer_id'] ?? null;
            $order->order_type = 2; // Takeaway/POS
            $order->name = $data['customer_name'] ?? 'Walk-in Customer';
            $order->mobile = $data['customer_phone'] ?? '';
            $order->email = $data['customer_email'] ?? '';
            $order->transaction_type = $data['payment_method'] ?? 1; // 1=Cash
            $order->tax_amount = $data['tax_amount'] ?? 0;
            $order->discount_amount = $data['discount_amount'] ?? 0;
            $order->grand_total = $data['grand_total'] ?? 0;
            $order->order_notes = $data['notes'] ?? '';
            $order->order_from = 'pos';
            $order->status_type = 3; // Completed
            $order->payment_status = 2; // Paid
            $order->delivery_charge = 0;
            $order->save();

            // Create OrderDetails for each item
            foreach ($data['items'] as $cartItem) {
                $od = new OrderDetails();
                $od->order_id = $order->id;
                $od->user_id = $data['customer_id'] ?? null;
                $od->item_id = $cartItem['id'];
                $od->item_name = $cartItem['name'] ?? '';
                $od->item_image = $cartItem['image'] ?? '';
                $od->qty = $cartItem['quantity'] ?? 1;
                $od->item_price = $cartItem['price'] ?? 0;
                $od->addons_name = $cartItem['addons_name'] ?? '';
                $od->addons_price = $cartItem['addons_price'] ?? '';
                $od->addons_total_price = $cartItem['addons_total'] ?? 0;
                $od->extras_name = $cartItem['extras_name'] ?? '';
                $od->extras_price = $cartItem['extras_price'] ?? '';
                $od->extras_total_price = $cartItem['extras_total'] ?? 0;
                $od->save();

                // Update stock if variation has stock management
                if (!empty($cartItem['variation_id'])) {
                    $variation = Variation::find($cartItem['variation_id']);
                    if ($variation && $variation->stck_management == 1) {
                        $variation->qty = max(0, $variation->qty - ($cartItem['quantity'] ?? 1));
                        $variation->save();
                    }
                }
            }

            DB::commit();

            return response()->json([
                'status' => 1,
                'message' => 'Order placed successfully!',
                'order_id' => $order->id,
                'order_number' => $order->order_number
            ], 200);

        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => 0,
                'message' => 'Payment processing failed: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Hold current cart
     */
    public function holdCart(Request $request)
    {
        try {
            $data = $request->all();

            if (empty($data['items']) || count($data['items']) === 0) {
                return response()->json(['status' => 0, 'message' => 'Cart is empty'], 400);
            }

            $heldCart = new PosHeldCart();
            $heldCart->reference_no = 'HOLD-' . date('YmdHis') . '-' . rand(100, 999);
            $heldCart->cashier_id = Auth::id();
            $heldCart->customer_id = $data['customer_id'] ?? null;
            $heldCart->items = json_encode($data['items']);
            $heldCart->subtotal = $data['subtotal'] ?? 0;
            $heldCart->tax_amount = $data['tax_amount'] ?? 0;
            $heldCart->discount_amount = $data['discount_amount'] ?? 0;
            $heldCart->total = $data['grand_total'] ?? 0;
            $heldCart->notes = $data['notes'] ?? '';
            $heldCart->status = 'held';
            $heldCart->save();

            return response()->json([
                'status' => 1,
                'message' => 'Cart held successfully!',
                'reference_no' => $heldCart->reference_no,
                'held_count' => PosHeldCart::where('status', 'held')->count()
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to hold cart: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * AJAX: Get all held carts
     */
    public function getHeldCarts()
    {
        try {
            $heldCarts = PosHeldCart::with('cashier_info')
                ->where('status', 'held')
                ->orderBy('id', 'DESC')
                ->get();

            return response()->json([
                'status' => 1,
                'carts' => $heldCarts
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to load held carts: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * AJAX: Recall a specific held cart
     */
    public function recallCart($id)
    {
        try {
            $cart = PosHeldCart::find($id);

            if (!$cart || $cart->status !== 'held') {
                return response()->json(['status' => 0, 'message' => 'Cart not found or already used'], 404);
            }

            return response()->json([
                'status' => 1,
                'cart' => $cart
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to recall cart: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * AJAX: Delete/cancel a held cart
     */
    public function deleteHeldCart($id)
    {
        try {
            $cart = PosHeldCart::find($id);

            if (!$cart) {
                return response()->json(['status' => 0, 'message' => 'Cart not found'], 404);
            }

            $cart->status = 'cancelled';
            $cart->save();

            return response()->json([
                'status' => 1,
                'message' => 'Held cart deleted successfully!',
                'held_count' => PosHeldCart::where('status', 'held')->count()
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to delete cart: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * AJAX: Search customers
     */
    public function getCustomers(Request $request)
    {
        try {
            $query = $request->query('query', '');

            $customers = User::where('type', 2)
                ->where('is_available', 1)
                ->where(function ($q) use ($query) {
                    if (!empty($query)) {
                        $q->where('name', 'LIKE', '%' . $query . '%')
                          ->orWhere('mobile', 'LIKE', '%' . $query . '%')
                          ->orWhere('email', 'LIKE', '%' . $query . '%');
                    }
                })
                ->select('id', 'name', 'email', 'mobile')
                ->limit(20)
                ->get();

            return response()->json(['status' => 1, 'customers' => $customers], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to load customers: ' . $th->getMessage()
            ], 500);
        }
    }

    /**
     * Print receipt
     */
    public function printReceipt($id)
    {
        try {
            $order = Order::with('user_info')->where('id', $id)->first();

            if (!$order) {
                abort(404, 'Order not found');
            }

            $orderDetails = OrderDetails::where('order_id', $id)->get();
            $settings = Settings::first();

            return view('admin.pos.receipt', compact('order', 'orderDetails', 'settings'));

        } catch (\Throwable $th) {
            abort(500, 'Failed to load receipt');
        }
    }

    /**
     * AJAX: Today's POS sales summary
     */
    public function todaySummary()
    {
        try {
            $today = now()->toDateString();

            $totalSales = Order::where('order_from', 'pos')
                ->whereDate('created_at', $today)
                ->count();

            $totalRevenue = Order::where('order_from', 'pos')
                ->whereDate('created_at', $today)
                ->sum('grand_total');

            $totalTransactions = Order::where('order_from', 'pos')
                ->whereDate('created_at', $today)
                ->where('payment_status', 2)
                ->count();

            return response()->json([
                'status' => 1,
                'total_sales' => $totalSales,
                'total_revenue' => number_format((float)$totalRevenue, 2),
                'total_transactions' => $totalTransactions
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => 0,
                'message' => 'Failed to load summary: ' . $th->getMessage()
            ], 500);
        }
    }
}
