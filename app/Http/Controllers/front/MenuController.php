<?php

namespace App\Http\Controllers\front;

use App\Helpers\helper;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Category;
use App\Models\Settings;
use App\Models\Subcategory;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Session;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        $user_id = @Auth::user()->id;
        $session_id = Session::getId();
        $topdeals = helper::top_deals();

        $categorydata = Category::where('slug', $request->category)->where('is_available', 1)->where('is_deleted', 2)->first();
        $subcategories = Subcategory::where('cat_id', @$categorydata->id)->where('is_available', 1)->where('is_deleted', 2)->orderBy('reorder_id')->get();


        if ($user_id != null) {

            $getitemlist = Item::with('category_info', 'subcategory_info', 'item_image')->select('item.*', DB::raw('(case when favorite.item_id is null then 0 else 1 end) as is_favorite'), DB::raw('(case when item.price is null then 0 else item.price end) as item_price'), DB::raw('(case when cart.item_id is null then 0 else 1 end) as is_cart'))
                ->leftJoin('favorite', function ($query) use ($user_id) {
                    $query->on('favorite.item_id', '=', 'item.id')
                        ->where('favorite.user_id', '=', $user_id);
                })
                ->leftJoin('cart', function ($query) use ($user_id) {
                    $query->on('cart.item_id', '=', 'item.id')
                        ->where('cart.user_id', '=', $user_id)
                        ->where('cart.buynow', '=', '0');
                })
                ->groupBy('item.id', 'cart.item_id')
                ->where('item.item_status', '1')
                ->where('item.cat_id', @$categorydata->id)
                ->orderBy('item.reorder_id');
        } else {
            $getitemlist = Item::with('category_info', 'subcategory_info', 'item_image')->select('item.*', DB::raw('(case when item.price is null then 0 else item.price end) as item_price'), DB::raw('(case when cart.item_id is null then 0 else 1 end) as is_cart'))
                ->leftJoin('cart', function ($query) use ($session_id) {
                    $query->on('cart.item_id', '=', 'item.id')
                        ->where('cart.session_id', '=', $session_id)
                        ->where('cart.buynow', '=', '0');
                })
                ->groupBy('item.id', 'cart.item_id')
                ->where('item.item_status', '1')
                ->where('item.cat_id', @$categorydata->id)
                ->orderBy('item.reorder_id');
        }

        if ($request->has('subcategory') && $request->subcategory != "") {
            $subcatdata = Subcategory::where('slug', $request->subcategory)->first();
            if (empty($subcatdata)) {
                return redirect()->back();
            }
            $getitemlist = $getitemlist->where('item.subcat_id', @$subcatdata->id);
        }
        $getitemlist = $getitemlist->orderByDesc('item.id')->paginate(16)->onEachSide(0);
        return view('web.menu', compact('topdeals', 'categorydata', 'subcategories', 'getitemlist'));
    }

    public function menus(){
        if (Auth::user() && Auth::user()->type == 2) {
            $getcartlist = Cart::where('user_id', Auth::user()->id)->where('buynow', 0)->orderByDesc('id')->get();
        } else {
            $getcartlist = Cart::where('session_id', \Illuminate\Support\Facades\Session::getId())->where('buynow', 0)->orderByDesc('id')->get();
        }

        $getsettings = Settings::first();
        $itemtaxes = [];
        $producttax = 0;
        $tax_name = [];
        $tax_price = [];


        foreach ($getcartlist as $cart) {
            $taxlist =  helper::gettax($cart->tax);
            if (!empty($taxlist)) {
                foreach ($taxlist as $tax) {
                    if (!empty($tax)) {
                        if (!in_array($tax->name, $tax_name)) {
                            $tax_name[] = $tax->name;

                            if ($tax->type == 1) {
                                $price = $tax->tax * $cart->qty;
                            }

                            if ($tax->type == 2) {
                                $price = ($tax->tax / 100) * ($cart->addons_total_price + $cart->item_price) * $cart->qty;
                            }
                            $tax_price[] = $price;
                        } else {
                            if ($tax->type == 1) {
                                $price = $tax->tax * $cart->qty;
                            }

                            if ($tax->type == 2) {
                                $price = ($tax->tax / 100) * ($cart->addons_total_price + $cart->item_price) * $cart->qty;
                            }
                            $tax_price[array_search($tax->name, $tax_name)] += $price;
                        }
                    }
                }
            }
        }

        $taxArr['tax'] = $tax_name;
        $taxArr['rate'] = $tax_price;
        $session_id = Session::getId();
        $categoryIds = Category::where('is_available', 1)->where('is_deleted', 2)->pluck('id')->toArray();
        $getitemlist = Item::with('category_info', 'subcategory_info', 'item_image')->select('item.*', DB::raw('(case when item.price is null then 0 else item.price end) as item_price'), DB::raw('(case when cart.item_id is null then 0 else 1 end) as is_cart'))
            ->leftJoin('cart', function ($query) use ($session_id) {
                $query->on('cart.item_id', '=', 'item.id')
                    ->where('cart.session_id', '=', $session_id)
                    ->where('cart.buynow', '=', '0');
            })
            ->groupBy('item.id', 'cart.item_id')
            ->where('item.item_status', '1')
            ->whereIn('item.cat_id', $categoryIds)
            ->orderBy('item.reorder_id')->orderByDesc('item.id')->get();
        return view('web.menus', compact('getcartlist', 'getsettings', 'taxArr', 'getitemlist'));
    }

    public function searchProducts($search=null){
        $session_id = Session::getId();
        $categoryIds = Category::where('is_available', 1)->where('is_deleted', 2)->pluck('id')->toArray();
        $getitemlist = Item::with('category_info', 'subcategory_info', 'item_image')->select('item.*', DB::raw('(case when item.price is null then 0 else item.price end) as item_price'), DB::raw('(case when cart.item_id is null then 0 else 1 end) as is_cart'))
            ->leftJoin('cart', function ($query) use ($session_id) {
                $query->on('cart.item_id', '=', 'item.id')
                    ->where('cart.session_id', '=', $session_id)
                    ->where('cart.buynow', '=', '0');
            })
            ->groupBy('item.id', 'cart.item_id')
            ->where('item.item_status', '1')
            ->whereIn('item.cat_id', $categoryIds);
        if (!empty($search)){
            $getitemlist = $getitemlist->where('item.item_name', 'LIKE', "%$search%");
        }
        $getitemlist = $getitemlist->orderBy('item.reorder_id')->orderByDesc('item.id')->get();
        return view('web.product_menu', compact('getitemlist'))->render();
    }

    public function categoryProducts($categoryId){
        $session_id = Session::getId();
        $categoryIds = [$categoryId];
        $getitemlist = Item::with('category_info', 'subcategory_info', 'item_image')->select('item.*', DB::raw('(case when item.price is null then 0 else item.price end) as item_price'), DB::raw('(case when cart.item_id is null then 0 else 1 end) as is_cart'))
            ->leftJoin('cart', function ($query) use ($session_id) {
                $query->on('cart.item_id', '=', 'item.id')
                    ->where('cart.session_id', '=', $session_id)
                    ->where('cart.buynow', '=', '0');
            })
            ->groupBy('item.id', 'cart.item_id')
            ->where('item.item_status', '1')
            ->whereIn('item.cat_id', $categoryIds);
        if (!empty($search)){
            $getitemlist = $getitemlist->where('item.item_name', 'LIKE', "%$search%");
        }
        $getitemlist = $getitemlist->orderBy('item.reorder_id')->orderByDesc('item.id')->get();
        return view('web.product_menu', compact('getitemlist'))->render();
    }
}
