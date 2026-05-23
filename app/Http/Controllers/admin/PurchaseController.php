<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\Item;
use App\Models\Variation;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PurchaseController extends Controller
{
    public function index()
    {
        $purchases = Purchase::with('supplier_info')->orderByDesc('id')->paginate(20);
        return view('admin.purchase.index', compact('purchases'));
    }

    public function create()
    {
        $suppliers = Supplier::where('status', 1)->orderBy('name')->get();
        $items = Item::where('is_deleted', 2)->where('item_status', 1)->orderBy('item_name')->get();
        return view('admin.purchase.create', compact('suppliers', 'items'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:item,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.cost_price' => 'required|numeric|min:0',
            'payment_status' => 'required|in:paid,partial,unpaid',
            'payment_method' => 'nullable|string|max:100',
            'discount_amount' => 'nullable|numeric|min:0',
            'tax_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        DB::beginTransaction();

        try {
            $total_amount = 0;
            foreach ($request->items as $item) {
                $total_amount += $item['quantity'] * $item['cost_price'];
            }

            $discount_amount = $request->discount_amount ?? 0;
            $tax_amount = $request->tax_amount ?? 0;
            $grand_total = $total_amount - $discount_amount + $tax_amount;

            $purchase = new Purchase;
            $purchase->supplier_id = $request->supplier_id;
            $purchase->reference_no = 'PO-' . date('YmdHis');
            $purchase->total_amount = $total_amount;
            $purchase->discount_amount = $discount_amount;
            $purchase->tax_amount = $tax_amount;
            $purchase->grand_total = $grand_total;
            $purchase->payment_status = $request->payment_status;
            $purchase->payment_method = $request->payment_method;
            $purchase->notes = $request->notes;
            $purchase->created_by = Auth::id();
            $purchase->save();

            foreach ($request->items as $item) {
                $line_total = $item['quantity'] * $item['cost_price'];

                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'cost_price' => $item['cost_price'],
                    'total' => $line_total,
                ]);

                // Update item stock - check if item has variations
                $product = Item::find($item['product_id']);
                if ($product) {
                    $variations = Variation::where('item_id', $product->id)->get();
                    if ($variations->count() > 0) {
                        // If item has variations, add stock to first variation
                        $firstVariation = $variations->first();
                        $firstVariation->qty = ($firstVariation->qty ?? 0) + $item['quantity'];
                        $firstVariation->save();
                    }
                }
            }

            ActivityLog::create([
                'user_id' => Auth::id(),
                'action' => 'create',
                'module' => 'purchase',
                'description' => 'Created purchase order: ' . $purchase->reference_no . ' for supplier ID: ' . $purchase->supplier_id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            DB::commit();

            return redirect('admin/purchases')->with('success', trans('messages.success'));
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Failed to create purchase order: ' . $e->getMessage())->withInput();
        }
    }

    public function show($id)
    {
        $purchase = Purchase::with('supplier_info', 'creator')->where('id', $id)->first();
        if (!$purchase) {
            return redirect('admin/purchase')->with('error', 'Purchase order not found.');
        }
        $purchaseItems = PurchaseItem::where('purchase_id', $id)->get();
        foreach ($purchaseItems as $pi) {
            $pi->product_info = Item::find($pi->product_id);
        }
        return view('admin.purchase.show', compact('purchase', 'purchaseItems'));
    }

    public function updatePaymentStatus(Request $request, $id)
    {
        $request->validate([
            'payment_status' => 'required|in:paid,partial,unpaid',
        ]);

        $purchase = Purchase::find($id);
        if (!$purchase) {
            return redirect('admin/purchases')->with('error', 'Purchase order not found.');
        }

        $purchase->payment_status = $request->payment_status;
        $purchase->save();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update',
            'module' => 'purchase',
            'description' => 'Updated payment status of ' . $purchase->reference_no . ' to ' . $request->payment_status,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect()->back()->with('success', trans('messages.success'));
    }
}
