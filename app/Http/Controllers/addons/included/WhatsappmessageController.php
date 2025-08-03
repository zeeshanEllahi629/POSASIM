<?php

namespace App\Http\Controllers\addons\included;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WhatsappMessage;
use Illuminate\Support\Facades\Validator;
use App\Helpers\whatsapp_helper;

class WhatsappmessageController extends Controller
{
    public function index()
    {
        return view('admin.included.whatsapp_message.setting_form');
    }

    public function order_message_update(Request $request)
    {

        try {
            $validator = Validator::make($request->all(), [
                'item_message' => 'required',
                'whatsapp_message' => 'required',
            ], [
                'item_message.required' => trans('messages.item_message_required'),
                'whatsapp_message.required' => trans('messages.whatsapp_message_required'),
            ]);
            $order_message = WhatsappMessage::first();
            $order_message->item_message = $request->item_message;
            $order_message->whatsapp_message = $request->whatsapp_message;
            $order_message->order_created = isset($request->order_created) ? 1 : 2;
            $order_message->whatsapp_chat_on_off = isset($request->whatsapp_chat_on_off) ? 1 : 2;
            $order_message->whatsapp_mobile_view_on_off = isset($request->whatsapp_mobile_view_on_off) ? 1 : 2;
            $order_message->whatsapp_chat_position = $request->whatsapp_chat_position;
            $order_message->save();
            return redirect()->back()->with('success', trans('messages.success'));
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', trans('messages.wrong'));
        }
    }

    public function status_message(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'status_message' => 'required',
            ], [
                'status_message.required' => trans('messages.status_message_required'),
            ]);
            $about = WhatsappMessage::first();
            $about->status_message = $request->status_message;
            $about->status_change = isset($request->status_change) ? 1 : 2;
            $about->save();
            return redirect()->back()->with('success', trans('messages.success'));
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', trans('messages.wrong'));
        }
    }

    public function business_api(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'whatsapp_number' => 'required',
                'whatsapp_phone_number_id' => 'required',
                'whatsapp_access_token' => 'required',
            ], [
                'whatsapp_number.required' => trans('messages.whatsapp_number_required'),
                'whatsapp_phone_number_id.required' => trans('messages.whatsapp_number_required'),
                'whatsapp_access_token.required' => trans('messages.whatsapp_number_required'),
            ]);
            $about = WhatsappMessage::first();
            $about->whatsapp_number = $request->whatsapp_number;
            $about->whatsapp_phone_number_id = $request->whatsapp_phone_number_id;
            $about->whatsapp_access_token = $request->whatsapp_access_token;
            $about->message_type = $request->message_type;
            $about->save();
            return redirect()->back()->with('success', trans('messages.success'));
        } catch (\Throwable $th) {
            return redirect()->back()->with('error', trans('messages.wrong'));
        }
    }

    public function sendonwhatsapp(Request $request)
    {
        try {
            if (whatsapp_helper::whatsapp_message_config()->order_created == 1) {
                whatsapp_helper::whatsappmessage($request->order_number);
            }
            return response()->json(['status' => 1, 'message' => trans('messages.success')]);
        } catch (\Throwable $th) {
            return response()->json(['status' => 0, 'message' => trans('messages.wrong')]);
        }
    }
}
