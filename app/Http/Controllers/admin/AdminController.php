<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Helpers\helper;
use App\Models\User;
use App\Models\Category;
use App\Models\Item;
use App\Models\Addons;
use App\Models\Ratting;
use App\Models\OrderDetails;
use App\Models\Banner;
use App\Models\Order;
use App\Models\Promocode;
use App\Models\Settings;
use App\Models\Time;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;
use DateTime;
use Session;

class AdminController extends Controller
{
    public function home(Request $request)
    {
        $gettotalcategory = Category::where('is_available', '1')->where('is_deleted', '2')->count();
        $getitems = Item::where('item_status', '1')->get();
        $addons = Addons::where('is_available', '1')->where('is_deleted', '2')->get();
        $getpromocode = Promocode::where('is_available', 1)->get();
        $getusers = User::Where('type', '=', '2')->get();
        $getdriver = User::where('is_available', '1')->where('type', '3')->get();
        $getreview = Ratting::all();
        $getorderscount = Order::all();
        $getorderdetailscount = OrderDetails::all();
        $banners = Banner::all();
        $order_total = Order::where('status', '!=', '6')->where('status', '!=', '7')->sum('grand_total');
        $order_tax = Order::where('status', '!=', '6')->where('status', '!=', '7')->sum('tax_amount');
        $getorders = Order::with('user_info')->select('order.*')->whereDate('created_at', Carbon::today())->get();

        $topitems = Item::with('category_info', 'subcategory_info', 'item_image')->leftJoin('order_details', 'order_details.item_id', 'item.id')
            ->select('item.id', 'item.cat_id', 'item.subcat_id', 'item.item_name', 'item.slug', DB::raw('count(order_details.item_id) as item_order_counter'))
            ->groupBy('order_details.item_id')
            ->orderByDesc('item_order_counter')
            ->having('item_order_counter', '>', 0)
            ->where('item.item_status', '1')
            ->get()->take(7);
        $topusers = User::leftJoin('order', 'order.user_id', 'users.id')
            ->select('users.id', 'users.name', 'users.email', 'users.mobile', 'profile_image', DB::raw('count(order.user_id) as user_order_counter'))
            ->groupBy('order.user_id')
            ->orderByDesc('user_order_counter')
            ->having('user_order_counter', '>', 0)
            ->where('users.type', '2')
            ->where('users.is_available', '1')
            ->get()->take(5);

        // ORDER-CHART-START
        $year = $request->getyear != "" ? $request->getyear : date('Y');
        $order_years = Order::select(DB::raw("YEAR(created_at) as year"))->groupBy(DB::raw("YEAR(created_at)"))->orderByDesc('created_at')->get();
        $orderlabels = Order::select(DB::raw("MONTHNAME(created_at) as month_name"))->whereYear('created_at', $year)->orderBy('created_at')->groupBy(DB::raw("MONTHNAME(created_at)"))->pluck('month_name');
        $deliverydata = $pickupdata = array();
        foreach ($orderlabels as $monthname) {
            $deliverydata[] = Order::whereYear('created_at', $year)->where('order_type', 1)->orderBy('created_at')->where(DB::raw("MONTHNAME(created_at)"), $monthname)->count();
            $pickupdata[] = Order::whereYear('created_at', $year)->where('order_type', 2)->orderBy('created_at')->where(DB::raw("MONTHNAME(created_at)"), $monthname)->count();
        }
        // ORDER-CHART-END


        // USERS-CHART-START
        $useryear = $request->useryear != "" ? $request->useryear : date('Y');
        $user_years = User::select(DB::raw("YEAR(created_at) as year"))->groupBy(DB::raw("YEAR(created_at)"))->orderByDesc('created_at')->get();
        $userslist = User::select(DB::raw("YEAR(created_at) as year"), DB::raw("MONTHNAME(created_at) as month_name"), DB::raw("COUNT(id) as total_user"))
            ->whereYear('created_at', $useryear)
            ->where('type', 2)
            ->orderBy('created_at')
            ->groupBy(DB::raw("MONTHNAME(created_at)"))
            ->pluck('total_user', 'month_name');
        $userslabels = $userslist->keys();
        $userdata = $userslist->values();
        // USERS-CHART-END

        // EARNINGS-CHART-START
        $earningsyear = $request->earningsyear != "" ? $request->earningsyear : date('Y');
        $earnings_years = Order::select(DB::raw("YEAR(created_at) as year"))->groupBy(DB::raw("YEAR(created_at)"))->orderByDesc('created_at')->get();
        $reviewslist = Order::select(DB::raw("YEAR(created_at) as year"), DB::raw("MONTHNAME(created_at) as month_name"), DB::raw("SUM(grand_total) as grand_total"))
            ->whereYear('created_at', $earningsyear)
            ->whereNotIn('status', array(1, 6, 7))
            ->orderBy('created_at')
            ->groupBy(DB::raw("MONTHNAME(created_at)"))
            ->pluck('grand_total', 'month_name');
        $earningslabels = $reviewslist->keys();
        $earningsdata = $reviewslist->values();
        // EARNINGS-CHART-END

        if (env('Environment') == 'sendbox') {
            $userslabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July ', 'August', 'September', 'October', 'November', 'December'];
            $userdata = [636, 1269, 2810, 2843, 3637, 467, 902, 1296, 402, 1173, 1509, 413];
            $earningslabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July ', 'August', 'September', 'October', 'November', 'December'];
            $earningsdata = [636, 1269, 2810, 2843, 2545, 467, 902, 1296, 402, 1173, 1509, 2000];
            $orderlabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July ', 'August', 'September', 'October', 'November', 'December'];
            $deliverydata = [285, 830, 550, 881, 130, 194, 213, 525, 245, 348, 581, 459];
            $pickupdata = [105, 343, 394, 299, 636, 984, 492, 135, 287, 250, 509, 121];
        }

        if ($request->ajax()) {
            return response()->json(['orderlabels' => $orderlabels, 'deliverydata' => $deliverydata, 'pickupdata' => $pickupdata, 'userslabels' => $userslabels, 'userdata' => $userdata, 'earningslabels' => $earningslabels, 'earningsdata' => $earningsdata], 200);
        } else {
            return view('admin.dashboard.home', compact('topitems', 'topusers', 'gettotalcategory', 'getitems', 'addons', 'getusers', 'banners', 'getreview', 'getorderscount', 'getorderdetailscount', 'order_total', 'order_tax', 'getpromocode', 'getorders', 'getdriver', 'order_years', 'orderlabels', 'deliverydata', 'pickupdata', 'user_years', 'userslabels', 'userdata', 'earnings_years', 'earningslabels', 'earningsdata'));
        }
    }
    public function getorder()
    {
        $todayorders = Order::with('user_info')->whereDate('created_at', Carbon::today())->where('is_notification', '=', '1')->count();
        $data = Settings::first();
        $noti = $data->notification_tune;
        return response()->json(['count' => $todayorders, 'noti' => $noti]);
    }
    public function login()
    {
        return view('login');
    }
    public function check_admin(Request $request)
    {
        session()->put('admin_login', '1');
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ],  [
            'email.required' => trans('messages.email_required'),
            'email.email' => trans('messages.valid_email'),
            'password.required' => trans('messages.password_required')
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        } else {
            if (Auth::attempt($request->only('email', 'password'))) {
                if (!Auth::user()) {
                    return Redirect::to('/auth')->with('error', Session::get('from_message'));
                }
                if (Auth::user()->type == 1) {
                    session()->forget('admin_login', '1');
                    return redirect()->route('dashboard');
                } else if (Auth::user()->type == 4) {
                    if (Auth::user()->is_available == 1) {
                        session()->forget('admin_login', '1');
                        return redirect()->route('dashboard');
                    } else {
                        Auth::logout();
                        return redirect()->back()->with('error', trans('messages.email_pass_invalid'));
                    }
                } else {
                    Auth::logout();
                    return redirect()->back()->with('error', trans('messages.email_pass_invalid'));
                }
            } else {
                return redirect()->back()->with('error', trans('messages.email_pass_invalid'));
            }
        }
    }
    public function send_pass(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
        ],  [
            'email.required' => trans('messages.email_required'),
            'email.email' => trans('messages.valid_email'),
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        } else {
            $checkadmin = User::where('email', $request->email)->whereIn('type', [1, 4])->first();
            if (!empty($checkadmin)) {
                $password = substr(str_shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 8);
                $pass = helper::send_pass($checkadmin->email, $checkadmin->name, $password);
                if ($pass == 1) {
                    $checkadmin->password = Hash::make($password);
                    $checkadmin->save();
                    return redirect('admin')->with('success', trans('messages.password_sent'));
                } else {
                    return redirect()->back()->with('error', trans('messages.email_error'));
                }
            } else {
                return redirect()->back()->with('error', trans('messages.invalid_email'));
            }
        }
    }
    public function changestatus(Request $request)
    {
        if (@helper::appdata()->timezone != "") {
            date_default_timezone_set(helper::appdata()->timezone);
        }
        $status = User::find(Auth::user()->id);
        $status->is_online = $status->is_online == 1 ? 2 : 1;
        $status->save();
        return redirect()->back()->with('success', trans('messages.success'));
    }

    public function editprofile(request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|unique:users,name,' . Auth::user()->id . ',id,is_deleted,2,type,1',
            'email' => 'required|unique:users,email,' . Auth::user()->id . ',id,is_deleted,2,type,1',
            'mobile' => 'required|unique:users,mobile,' . Auth::user()->id . ',id,is_deleted,2,type,1',
        ], [
            "name.required" => trans('messages.name_required'),
            "email.required" => trans('messages.email_required'),
            "email.unique" => trans('messages.email_exist'),
            "mobile.required" => trans('messages.mobile_required'),
            "mobile.unique" => trans('messages.mobile_exist'),
        ]);
        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        } else {
            if ($request->hasfile('profile')) {
                if (Auth::user()->profile_image != "unknown.png" && file_exists(env('ASSETSPATHURL') . 'admin-assets/images/profile/' . Auth::user()->profile_image)) {
                    unlink(env('ASSETSPATHURL') . 'admin-assets/images/profile/' . Auth::user()->profile_image);
                }
                $profile = 'profile-' . uniqid() . '.' . $request->profile->getClientOriginalExtension();
                $request->profile->move(env('ASSETSPATHURL') . 'admin-assets/images/profile', $profile);
                $checkuser = User::find(Auth::user()->id);
                $checkuser->profile_image = $profile;
                $checkuser->save();
            }
            $checkuser = User::find(Auth::user()->id);
            $checkuser->name = $request->name;
            $checkuser->email = $request->email;
            $checkuser->mobile = $request->mobile;
            $checkuser->save();
            return redirect()->back()->with('success', trans('messages.success'));
        }
    }
    public function changepassword(request $request)
    {
        if (Hash::check($request->oldpassword, Auth::user()->password)) {
            if ($request->oldpassword != $request->newpassword) {
                if ($request->newpassword == $request->confirmpassword) {
                    User::where('id', Auth::user()->id)->update(['password' => Hash::make($request->newpassword)]);
                    return redirect()->back()->with('success', trans('messages.success'));
                } else {
                    return redirect()->back()->with('error', trans('messages.confirm_password_same'));
                }
            } else {
                return redirect()->back()->with('error', trans('messages.new_password_diffrent'));
            }
        } else {
            return redirect()->back()->with('error', trans('messages.old_password_invalid'));
        }
    }
    public function logout(Request $request)
    {
        Auth::logout();
        return Redirect::to('admin/');
    }

    public function auth(Request $request)
    {
        $username = str_replace(' ', '', $request->username);
        $client = new \GuzzleHttp\Client();
        $res = $client->request('POST', \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6Iks2VzVNbkFNVEQyM2MzWnB0U3NrZ2c9PSIsInZhbHVlIjoibHAvUE1xZWN1Y3dRM1BhaEFkTGZhMHlVekEzalgxb1hnQkg0M0ZLN0RFa3UrdXo2VFE4WmVXSlJ0S3FKd2JTSW1jMDkrOFlmRTQrcmVSQVZINklPNnc9PSIsIm1hYyI6ImQxYzUyOGIyM2M0NzYyZmQ0MjYyMzlmZWM4YWVmMTUxZTBkMmM5ZDNjYTI0YWVhMWRlZjZlYjg5ZGI5MDg4Y2UiLCJ0YWciOiIifQ=='), [
            'form_params' => [
                \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6ImJkS3crTk9COHRYL0tQK2kxRERNQXc9PSIsInZhbHVlIjoiU0NIcmkrT2xJdkppcnJ5cFY4OW5XWllud3c4Z3QyaGVHK0hYVVUyNnc3UT0iLCJtYWMiOiI0Njg1NTcwNTAxNTI0ODFmZDE0Y2FmMWU4M2M3ZGFkZThjNDgxZWZlNTY1ZmVkOTdiNGZjM2VkNDI5MmI2NTljIiwidGFnIjoiIn0=') => $username,
                \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6ImU5NjI5NFRTQXRWeTRHQndWVHJsUXc9PSIsInZhbHVlIjoiNHpzaHFCVjc0ajVKMktNampzN0NvUT09IiwibWFjIjoiODU5M2M0Y2VhMDE5YjgyNzU5MWE4NzZjOGUxNjlkZWFhMWI0ZjJiYTU2YTQ1NTMwYzI4YjBhMjg5Y2VhNzNiYiIsInRhZyI6IiJ9') => $request->email,
                \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6IkxHVHdQNGo0Vzd1TktaS21kZEQwL1E9PSIsInZhbHVlIjoiRDEvUGZZa3MzbkkzQ0pxUFlrRFJOektiU1FLN3YvZ3ZHK25UcE95UHFzdz0iLCJtYWMiOiI5NWJlNDVmM2VkNWViZDYxNTIwNGI1MWI0ZTU0YWEzN2VkNjhhZDZlM2QwOWMyOGY5OTFkYTY5ODVkNWY2NDdiIiwidGFnIjoiIn0=') => $request->purchase_key,
                \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6IlRTOCtHbEI3Slh3Wm1sWHRCNWM2SWc9PSIsInZhbHVlIjoiNGxHU2puYjdnaCtUUVhJeFVNa014dz09IiwibWFjIjoiNzY4ZjI2MjZmZTVjMjI1NTZhNGZjMjNjYjE4M2MyODUxOTkwNWE2NjA1MjI3NTRiOTViMDY3Zjc3OTEzYWY2NSIsInRhZyI6IiJ9') => $request->domain,
                \Illuminate\Support\Facades\Crypt::decrypt('^ "eyJpdiI6IlZSSHhaNC8rOFVHRHNsdXVseDZRTGc9PSIsInZhbHVlIjoieGp2aEFLOU85OGdPeUNDck9TeUg2WW12Y3d4L3AyeHNwRXh5dXN2UTRJVT0iLCJtYWMiOiI2NzE3NmIxM2M3YzgzM2JjMDkyMjMyMGUwODFhZDA3NzVhZDI4YmJjMDk4NzJiYmI1M2NkZWRmZTZhNzZhZWM0IiwidGFnIjoiIn0=') => \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6IlVJVTlCMXozN3BtY1RHTUZIS2N3ZXc9PSIsInZhbHVlIjoicXIreUdDeXNMb2lIZUg1QUphM1lCdz09IiwibWFjIjoiMWM2NzEyOTYzNjNmMzIwY2NjZWY2NGY2ZDIxMzNiNDIxMWUyMzc2MGQ1ODQyMmVkNzlkYjcxZDM5ZGRiYzI5YiIsInRhZyI6IiJ9'),
                \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6Ii9xbk0yamJvZTVRdXFUY1FPaE5DZ2c9PSIsInZhbHVlIjoidVJJUk5YZzMxc2VCOFVjUFJsZ2hCUT09IiwibWFjIjoiZjM5MzkxOWIxNmE5NWQxMzljMDZlNGVhZThlNWVmYmY2MzFkMmU5NDUxNmRiMTRkNWRjNGJmY2I5YzNhZDA3ZCIsInRhZyI6IiJ9') => \Illuminate\Support\Facades\Crypt::decrypt('eyJpdiI6IjJ2WmlxOHJBNzk2LzU0aENVMjJPemc9PSIsInZhbHVlIjoiUEF4Z1IrMjl1SkRGbzZFdXhSVG9wdz09IiwibWFjIjoiODM4YjgyMWYyZDY4NGMxODNjNmRiY2ExNWU4MzkzNWJlZGI1MjU3MjEwODFjMDA0NzY5YTZmNDJkNDZlY2Q5MiIsInRhZyI6IiJ9'),
            ]
        ]);

        $obj = json_decode($res->getBody());
        if ($obj->status == '1') {
            User::where('id', 1)->update(['license_type' => @$obj->license_type]);
            return Redirect::to('/admin')->with('success', 'Success');
        } else {
            return Redirect::back()->with('error', @$obj->message);
        }
    }

    public function sessionsave(Request $request)
    {
        session()->put('demo', $request->demo_type);

        return response()->json(['status' => 1, 'msg' => trans('messages.success')], 200);
    }
}
