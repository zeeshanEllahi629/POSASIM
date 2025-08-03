<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Bookings;
use App\Helpers\helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class BookingsController extends Controller
{
    public function store(Request $request)
    {
        try {
            $booking_number = substr(str_shuffle(str_repeat("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10)), 0, 10);
            $date = helper::date_format($request->date);
            $time = helper::time_format($request->time);
            $emaildata = helper::emailconfigration();
            Config::set('mail', $emaildata);
            helper::online_table_booking($booking_number, $request->name, $request->email, $request->mobile, $request->guests, $request->reservation_type, $date, $time, $request->special_request);

            $booking = new Bookings();
            $booking->booking_number = $booking_number;
            $booking->date = $date;
            $booking->time = $time;
            $booking->guests = $request->guests;
            $booking->reservation_type = $request->reservation_type;
            $booking->name = $request->name;
            $booking->email = $request->email;
            $booking->mobile = $request->mobile;
            $booking->special_request = $request->special_request;
            $booking->status = 1;
            $booking->save();
            return redirect()->back()->with('success', trans('messages.success'));
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', trans('messages.wrong'));
        }
    }
}
