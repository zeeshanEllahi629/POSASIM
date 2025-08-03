<?php

namespace App\Http\Controllers\addons;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ratting;
use App\Helpers\helper;
use App\Models\Item;
use App\Models\Settings;
use Illuminate\Support\Facades\Auth;

class RattingController extends Controller
{
    public function addreview(Request $request)
    {
        if (Auth::user()) {
            if (!helper::check_review_exist(Auth::user()->id, $request->item_id)) {
                if (helper::appdata()->review_approved_status == 1) {
                    if (in_array($request->ratting, explode(',', helper::appdata()->review_auto_approved))) {
                        $status = 1;
                    } else {
                        $status = 2;
                    }
                } else {
                    $status = 2;
                }
                $ratting = new Ratting;
                $ratting->user_id = Auth::user()->id;
                $ratting->item_id = $request->item_id;
                $ratting->ratting = $request->ratting;
                $ratting->comment = $request->comment == null ? '-' : $request->comment;
                $ratting->status = $status;
                if ($ratting->save()) {
                    $product = Item::where('id', $request->item_id)->first();
                    $product->avg_ratting = number_format(Ratting::where('item_id', $request->item_id)->where('status', 1)->avg('ratting'), 1);
                    $product->save();
                }
                return redirect()->back()->with('success', trans('messages.success'));
            } else {
                return redirect()->back()->with('error', trans('messages.review_exist'));
            }
        }
    }

    public function settings_update(Request $request)
    {
        if ($request->review_setting_update) {
            $setting = Settings::first();
            if (empty($setting)) {
                $setting = new Settings();
            }
            if ($request->review_approved_status == null) {
                $review_approved_data = $setting->review_auto_approved;
            } else {
                $review_approved_data = null;
            }
            $setting->review_auto_approved = $request->review_auto_approved == null ? $review_approved_data : implode(',', $request->review_auto_approved);
            $setting->review_approved_status = $request->review_approved_status == null || $request->review_auto_approved == null ? 2 : $request->review_approved_status;
            $setting->save();
        }
        return redirect('admin/settings')->with('success', trans('messages.success'));
    }
    public function index(Request $request)
    {
        $getreview = Ratting::with('user_info', 'item_info')->where('user_id', '!=', '1')->where('item_id', '!=', 'null');
        $sorter = $request->get('item_id');
        if (!empty($sorter)) {
            $getreview->where('item_id', $sorter);
        }
        $getreview = $getreview->orderBydesc('id')->get();
        $reviewdata = Ratting::where('user_id', '!=', '1')->where('item_id', '!=', 'null')->groupBy('item_id')->get();
        $getproduct = [];
        foreach ($reviewdata as $review) {
            $product = Item::select('id', 'item_name')->where('id', $review->item_id)->orderBydesc('id')->first();
            $getproduct[] = $product;
        }
        return view('admin.reviews.reviews', compact('getreview', 'sorter', 'getproduct'));
    }
    public function destroy(Request $request)
    {
        $review = Ratting::where('id', $request->id)->first();
        if ($review->delete()) {
            $product = Item::where('id', $review->item_id)->first();
            $product->avg_ratting = number_format(Ratting::where('item_id', $review->item_id)->where('status', 1)->avg('ratting'), 1);
            $product->save();
            return 1;
        } else {
            return 0;
        }
    }
    public function status(Request $request)
    {
        $review = Ratting::where('id', $request->id)->first();
        $review->status = $request->status;
        if ($review->save()) {
            $product = Item::where('id', $review->item_id)->first();
            $product->avg_ratting = number_format(Ratting::where('item_id', $review->item_id)->where('status', 1)->avg('ratting'), 1);
            $product->save();
            return 1;
        } else {
            return 0;
        }
    }
}
