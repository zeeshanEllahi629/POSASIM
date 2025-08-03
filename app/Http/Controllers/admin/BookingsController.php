<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\helper;
use App\Models\Bookings;
use Illuminate\Support\Facades\Config;

class BookingsController extends Controller
{
    public function bookings(Request $request)
    {
        $getbookings = Bookings::orderByDesc('id')->get();
        return view('admin.bookings.bookings', compact('getbookings'));
    }
    public function bookingstatus(Request $request)
    {
        $reservationdata = Bookings::where('id', $request->id)->first();
        try {
            if ($request->status == "2") {
                if ($request->table_number == "") {
                    return response()->json(["status" => 0, "message" => trans('messages.table_number_required'), "id" => $request->id], 200);
                }
            }
            $title = '';
            $body = '';
            if ($request->status == 2) {
                $var = ["{name}", "{booking_number}", "{table_number}"];
                $newvar = [$reservationdata->name, $reservationdata->booking_number, $request->table_number];
                $online_table_booking_accept_message = str_replace($var, $newvar, nl2br(helper::appdata()->online_table_booking_accept_email_message));
                $title = trans('labels.booking_accepted');
                $body = $online_table_booking_accept_message;
                $reservationdata->table_number = $request->table_number;
            }
            if ($request->status == 3) {
                $var = ["{name}", "{booking_number}"];
                $newvar = [$reservationdata->name, $reservationdata->booking_number];
                $online_table_booking_reject_message = str_replace($var, $newvar, nl2br(helper::appdata()->online_table_booking_reject_email_message));
                $title = trans('labels.booking_rejected');
                $body = $online_table_booking_reject_message;
                $reservationdata->table_number = NULL;
            }
            // send-email
            $emaildata = helper::emailconfigration();
            Config::set('mail', $emaildata);
            helper::online_table_booking_status($reservationdata->email, $body, $title);
            $reservationdata->status = $request->status;
            if ($reservationdata->save()) {
                return response()->json(["status" => 1, "message" => trans('messages.success')], 200);
            } else {
                return response()->json(["status" => 0, "message" => trans('messages.wrong'), "id" => $request->id], 200);
            }
        } catch (\Throwable $th) {
            return response()->json(["status" => 0, "message" => $th->getMessage(), "id" => $request->id], 200);
        }
    }
}
