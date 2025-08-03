<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\helper;
use App\Models\Promocode;
use App\Models\Order;

class PromocodeController extends Controller
{
    public function checkpromocode(Request $request)
    {
        if ($request->sub_total == "") {
            return response()->json(["status" => 0, "message" => trans('messages.subtotal_required')], 200);
        }
        if ($request->offer_code == "") {
            return response()->json(["status" => 0, "message" => trans('messages.promocode_required')], 200);
        }
        $checkoffercode = Promocode::where('promocode.offer_code', $request->offer_code)->where('is_available', 1)->first();
        if (!empty($checkoffercode)) {
            if ((date('Y-m-d') >= $checkoffercode->start_date) && (date('Y-m-d') <= $checkoffercode->expire_date)) {
                if ($request->sub_total >= $checkoffercode->min_amount) {
                    $checkcount = Order::select('offer_code')->where('offer_code', $request->offer_code)->count();
                    if ($checkoffercode->usage_type == 1) {
                        if ($checkcount < $checkoffercode->usage_limit) {
                            if ($checkoffercode->offer_type == 1) {
                                $offer_amount = $checkoffercode->offer_amount;
                            } else {
                                $offer_amount = $request->sub_total * $checkoffercode->offer_amount / 100;
                            }
                            $arr = array(
                                "offer_code" => $checkoffercode->offer_code,
                                "offer_amount" => $offer_amount,
                            );
                            session()->put('discount_data', $arr);
                            return response()->json(["status" => 1, "message" => trans('messages.success'), 'data' => $arr], 200);
                        } else {
                            return response()->json(["status" => 0, "message" => trans('messages.once_per_user')], 200);
                        }
                    } else {
                        if ($checkoffercode->offer_type == 1) {
                            $offer_amount = $checkoffercode->offer_amount;
                        } else {
                            $offer_amount = $request->sub_total * $checkoffercode->offer_amount / 100;
                        }
                        $arr = array(
                            "offer_code" => $checkoffercode->offer_code,
                            "offer_amount" => $offer_amount,
                        );
                        session()->put('discount_data', $arr);
                        return response()->json(["status" => 1, "message" => trans('messages.success'), 'data' => $arr], 200);
                    }
                } else {
                    return response()->json(["status" => 0, "message" => trans('messages.order_amount_greater_then') . ' : ' . helper::currency_format($checkoffercode->min_amount)], 200);
                }
            } else {
                return response()->json(["status" => 0, "message" => trans('messages.offer_expired')], 200);
            }
        } else {
            return response()->json(["status" => 0, "message" => trans('messages.invalid_promocode')], 200);
        }
    }
    public function removepromocode()
    {
        session()->forget('discount_data');
        return response()->json(['status' => 1, 'message' => trans('messages.success')], 200);
    }
}
