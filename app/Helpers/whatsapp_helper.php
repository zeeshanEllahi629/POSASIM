<?php

namespace App\Helpers;

use App\Models\Order;
use App\Models\OrderDetails;
use App\Models\WhatsappMessage;
use URL;

class whatsapp_helper
{
    public static function whatsapp_message_config()
    {
        $whatsappp = WhatsappMessage::first();
        return $whatsappp;
    }

    public static function whatsappmessage($order_number)
    {
        $pagee[] = "";
        $totaltax[] = "";
        $subtotal = 0;
        $orderdata = Order::where('order_number', $order_number)->first();
        $data = OrderDetails::where('order_id', $orderdata->id)->orderByDesc('id')->get();
        foreach ($data as $value) {
            $item_p = $value['qty'] * ($value['item_price'] + $value['addons_total_price'] + $value['extras_total_price']);
            $subtotal += $item_p;

            $item_message = @whatsapp_helper::whatsapp_message_config()->item_message;
            $itemvar = ["{qty}", "{item_name}", "{item_price}", "{total}"];
            $newitemvar = [$value['qty'], $value['item_name'], @helper::currency_format($value['item_price'] + $value['addons_total_price'] + $value['extras_total_price']), @helper::currency_format($item_p)];
            $pagee[] = str_replace($itemvar, $newitemvar, $item_message);

            $addons_id = explode("|", $value['addons_id']);
            $addons_name = explode("|", $value['addons_name']);
            $addons_price = explode("|", $value['addons_price']);
            if ($value['addons_id'] != "") {
                foreach ($addons_id as $key => $addons) {
                    @$pagee[] .= "      👉" . $addons_name[$key] . ' : ' . @helper::currency_format($addons_price[$key]);
                }
            }

            $extras_id = explode("|", $value['extras_id']);
            $extras_name = explode("|", $value['extras_name']);
            $extras_price = explode("|", $value['extras_price']);
            if ($value['extras_id'] != "") {
                foreach ($extras_id as $key => $extras) {
                    @$pagee[] .= "      👉" . $extras_name[$key] . ' : ' . @helper::currency_format($extras_price[$key]);
                }
            }
        }
        $tax_amount = explode("|", $orderdata->tax_amount);
        $tax_name = explode("|", $orderdata->tax_name);
        if ($orderdata->tax_amount != "" && $orderdata->tax_name != "") {
            foreach ($tax_amount as $key => $amount) {
                @$totaltax[] .= "👉" . $tax_name[$key] . ' : ' . @helper::currency_format($tax_amount[$key]);
            }
        }
        $tax = implode("|", $totaltax);
        $items = implode("|", $pagee);

        $taxs = str_replace('|', '%0a', $tax);
        $itemlist = str_replace('|', '%0a', $items);

        if ($orderdata->order_type == 1) {
            $order_type = trans('labels.delivery');
            $address_type = "Delivery Address";
        } else {
            $order_type = trans('labels.pickup');
            $address_type = "Pickup Address";
        }

        $transaction_type = helper::getpayment($orderdata->transaction_type);

        $var = ["{delivery_type}", "{order_no}", "{item_variable}", "{tips}", "{sub_total}", "{all_tax}", "{delivery_charge}", "{discount_amount}", "{grand_total}", "{address_type}", "{notes}", "{customer_name}", "{customer_mobile}", "{address}", "{city}", "{state}", "{country}", "{landmark}", "{pincode}", "{payment_type}", "{track_order_url}", "{store_url}"];
        $newvar = [$order_type, $order_number, $itemlist, @helper::currency_format($orderdata->tips), @helper::currency_format($subtotal), $taxs, @helper::currency_format($orderdata->delivery_charge), @helper::currency_format($orderdata->discount_amount), helper::currency_format($orderdata->grand_total), $address_type, $orderdata->order_notes, $orderdata->name, $orderdata->mobile, str_replace("\n", "\\r\\n", $orderdata->address), $orderdata->city, $orderdata->state, $orderdata->country, $orderdata->landmark, $orderdata->postal_code, $transaction_type, URL::to("orders-" . $order_number), URL::to('/')];
        $whmessage = str_replace($var, $newvar, str_replace("\n", "%0a", @whatsapp_helper::whatsapp_message_config()->whatsapp_message));
        if (whatsapp_helper::whatsapp_message_config()->message_type == 1) {
            $whmessage = str_replace($var, $newvar, str_replace("\r\n", "%0a", @whatsapp_helper::whatsapp_message_config()->whatsapp_message));
            $curl = curl_init();

            curl_setopt_array($curl, array(
                CURLOPT_URL => 'https://graph.facebook.com/v18.0/' . whatsapp_helper::whatsapp_message_config()->whatsapp_phone_number_id . '/messages',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_ENCODING => '',
                CURLOPT_MAXREDIRS => 10,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_POSTFIELDS => '{
                "messaging_product": "whatsapp",
                "to": "917016428845",
                "text": {
                    "body" : "' . $whmessage . '"
                }
            }',
                CURLOPT_HTTPHEADER => array(
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . whatsapp_helper::whatsapp_message_config()->whatsapp_access_token . ''
                ),
            ));

            $response = curl_exec($curl);
            curl_close($curl);
        }

        return $whmessage;
    }

    public static function orderupdatemessage($order_number, $status)
    {
        $orderdata = Order::where('order_number', $order_number)->first();

        $var = ["{order_no}", "{customer_name}", "{track_order_url}", "{status}"];
        $newvar = [$order_number, $orderdata->name, URL::to("orders-" . $order_number), $status];
        $whmessage = str_replace($var, $newvar, str_replace("\r\n", "\\r\\n", @whatsapp_helper::whatsapp_message_config()->status_message));
        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => 'https://graph.facebook.com/v18.0/' . whatsapp_helper::whatsapp_message_config()->whatsapp_phone_number_id . '/messages',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => '',
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 0,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_POSTFIELDS => '{
              "messaging_product": "whatsapp",
              "to": "917016428845",
              "text": {
                  "body" : "' . $whmessage . '"
              }
          }',
            CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json',
                'Authorization: Bearer ' . whatsapp_helper::whatsapp_message_config()->whatsapp_access_token . ''
            ),
        ));

        $response = curl_exec($curl);
        curl_close($curl);

        return $whmessage;
    }
}
