<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Category;
use App\Models\Variation;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    /**
     * Inventory dashboard overview
     */
    public function dashboard()
    {
        $totalProducts = Item::where('is_deleted', 2)->count();
        $inStock = Item::where('is_deleted', 2)->where('item_status', 1)->count();

        // Low stock: variations with qty <= low_qty and stock_management enabled
        $lowStockVariations = Variation::where('stock_management', 1)
            ->whereColumn('qty', '<=', 'low_qty')
            ->where('qty', '>', 0)
            ->count();

        // Out of stock
        $outOfStock = Variation::where('stock_management', 1)
            ->where('qty', '<=', 0)
            ->count();

        // Total stock value
        $stockValue = Variation::where('stock_management', 1)
            ->select(DB::raw('SUM(qty * price) as total_value'))
            ->first()->total_value ?? 0;

        // Top 10 low stock items
        $lowStockItems = Variation::where('stock_management', 1)
            ->whereColumn('qty', '<=', 'low_qty')
            ->where('qty', '>', 0)
            ->orderBy('qty', 'ASC')
            ->limit(10)
            ->get();

        // Load item info for each variation
        foreach ($lowStockItems as $item) {
            $item->item_info = Item::with('category_info')->find($item->item_id);
        }

        // Items expiring within 30 days
        $expiringItems = Item::where('is_deleted', 2)
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->where('expiry_date', '>=', now())
            ->orderBy('expiry_date', 'ASC')
            ->limit(10)
            ->get();

        return view('admin.inventory.dashboard', compact(
            'totalProducts', 'inStock', 'lowStockVariations', 'outOfStock',
            'stockValue', 'lowStockItems', 'expiringItems'
        ));
    }

    /**
     * Stock list with filters
     */
    public function stockList(Request $request)
    {
        $categories = Category::where('is_available', 1)->where('is_deleted', 2)->orderBy('reorder_id')->get();

        $query = Item::with(['category_info', 'item_image'])
            ->where('is_deleted', 2);

        // Category filter
        if ($request->filled('category_id')) {
            $query->where('cat_id', $request->category_id);
        }

        // Search
        if ($request->filled('search')) {
            $query->where('item_name', 'LIKE', '%' . $request->search . '%');
        }

        $items = $query->orderBy('id', 'DESC')->paginate(25);

        // Load variations for each item
        foreach ($items as $item) {
            $item->variations_list = Variation::where('item_id', $item->id)->get();
            $item->total_stock = $item->variations_list->sum('qty');
            $item->has_low_stock = $item->variations_list->where('stock_management', 1)
                ->filter(function ($v) { return $v->qty <= $v->low_qty && $v->qty > 0; })->count() > 0;
            $item->has_out_of_stock = $item->variations_list->where('stock_management', 1)
                ->filter(function ($v) { return $v->qty <= 0; })->count() > 0;
        }

        // Stock status filter (post-query filter)
        $stockStatus = $request->get('stock_status', 'all');

        return view('admin.inventory.stock_list', compact('items', 'categories', 'stockStatus'));
    }

    /**
     * Adjust stock for an item
     */
    public function adjustStock(Request $request, $id)
    {
        $item = Item::with(['category_info', 'item_image'])->findOrFail($id);
        $variations = Variation::where('item_id', $id)->get();

        if ($request->isMethod('post')) {
            DB::beginTransaction();
            try {
                $adjustmentType = $request->input('adjustment_type', 'set');
                $reason = $request->input('reason', '');

                if ($item->has_variation == 1) {
                    // Update each variation
                    $variationQtys = $request->input('variation_qty', []);
                    foreach ($variationQtys as $varId => $qty) {
                        $variation = Variation::find($varId);
                        if ($variation) {
                            $oldQty = $variation->qty;
                            if ($adjustmentType == 'add') {
                                $variation->qty = $variation->qty + (int)$qty;
                            } elseif ($adjustmentType == 'remove') {
                                $variation->qty = max(0, $variation->qty - (int)$qty);
                            } else {
                                $variation->qty = (int)$qty;
                            }
                            $variation->save();

                            // Log
                            ActivityLog::create([
                                'user_id' => Auth::id(),
                                'action' => 'stock_adjustment',
                                'module' => 'inventory',
                                'description' => "Item: {$item->item_name} | Variation: {$variation->name} | Old Qty: {$oldQty} | New Qty: {$variation->qty} | Type: {$adjustmentType} | Reason: {$reason}",
                                'ip_address' => $request->ip()
                            ]);
                        }
                    }
                } else {
                    // Simple item - update first variation or create one
                    $variation = Variation::where('item_id', $id)->first();
                    if ($variation) {
                        $oldQty = $variation->qty;
                        $qty = (int)$request->input('stock_qty', 0);
                        if ($adjustmentType == 'add') {
                            $variation->qty = $variation->qty + $qty;
                        } elseif ($adjustmentType == 'remove') {
                            $variation->qty = max(0, $variation->qty - $qty);
                        } else {
                            $variation->qty = $qty;
                        }
                        $variation->save();

                        ActivityLog::create([
                            'user_id' => Auth::id(),
                            'action' => 'stock_adjustment',
                            'module' => 'inventory',
                            'description' => "Item: {$item->item_name} | Old Qty: {$oldQty} | New Qty: {$variation->qty} | Type: {$adjustmentType} | Reason: {$reason}",
                            'ip_address' => $request->ip()
                        ]);
                    }
                }

                DB::commit();
                return redirect()->back()->with('success', 'Stock adjusted successfully!');
            } catch (\Exception $e) {
                DB::rollBack();
                return redirect()->back()->with('error', 'Failed to adjust stock: ' . $e->getMessage());
            }
        }

        return view('admin.inventory.adjust', compact('item', 'variations'));
    }

    /**
     * Stock adjustment history
     */
    public function stockHistory()
    {
        $logs = ActivityLog::where('module', 'inventory')
            ->with('user_info')
            ->orderBy('id', 'DESC')
            ->paginate(20);

        return view('admin.inventory.history', compact('logs'));
    }

    /**
     * Low stock alerts
     */
    public function lowStockAlerts()
    {
        $lowStockItems = Variation::where('stock_management', 1)
            ->whereColumn('qty', '<=', 'low_qty')
            ->where('qty', '>', 0)
            ->orderBy('qty', 'ASC')
            ->paginate(25);

        foreach ($lowStockItems as $item) {
            $item->item_info = Item::with('category_info')->find($item->item_id);
        }

        // Expiring items
        $expiringItems = Item::where('is_deleted', 2)
            ->whereNotNull('expiry_date')
            ->where('expiry_date', '<=', now()->addDays(30))
            ->orderBy('expiry_date', 'ASC')
            ->with('category_info')
            ->paginate(25);

        return view('admin.inventory.alerts', compact('lowStockItems', 'expiringItems'));
    }
}
