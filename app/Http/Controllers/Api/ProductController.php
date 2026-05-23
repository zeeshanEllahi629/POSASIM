<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Category;

class ProductController extends Controller
{
    public function categories()
    {
        $categories = Category::where('is_available', 1)->get();
        return response()->json([
            'status' => 1,
            'data' => $categories
        ]);
    }

    public function products(Request $request)
    {
        $query = Item::with(['category_info', 'variation', 'extras'])->where('item_status', 1);

        if ($request->has('category_id')) {
            $query->where('cat_id', $request->category_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('item_name', 'LIKE', "%{$search}%")
                  ->orWhere('barcode', 'LIKE', "%{$search}%");
            });
        }

        $products = $query->paginate(20);

        return response()->json([
            'status' => 1,
            'data' => $products
        ]);
    }

    public function productDetails($id)
    {
        $product = Item::with(['category_info', 'variation', 'extras'])->find($id);
        
        if (!$product) {
            return response()->json([
                'status' => 0,
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json([
            'status' => 1,
            'data' => $product
        ]);
    }
}
