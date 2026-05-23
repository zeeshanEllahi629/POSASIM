<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;

class InventoryController extends Controller
{
    public function stock(Request $request)
    {
        // Simple stock API. If branches exist, we could filter by branch_id
        $query = Item::select('id', 'item_name', 'stock', 'low_stock_alert')
            ->where('item_status', 1);

        if ($request->has('category_id')) {
            $query->where('cat_id', $request->category_id);
        }

        if ($request->has('low_stock') && $request->low_stock == 1) {
            $query->whereColumn('stock', '<=', 'low_stock_alert');
        }

        $inventory = $query->paginate(20);

        return response()->json([
            'status' => 1,
            'data' => $inventory
        ]);
    }
}
