<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Item;
use App\Models\OrderDetails;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function dashboard(Request $request)
    {
        $period = $request->get('period', 'this_month');
        
        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        if ($period == 'today') {
            $startDate = Carbon::today();
            $endDate = Carbon::today()->endOfDay();
        } elseif ($period == 'this_week') {
            $startDate = Carbon::now()->startOfWeek();
            $endDate = Carbon::now()->endOfWeek();
        } elseif ($period == 'last_month') {
            $startDate = Carbon::now()->subMonth()->startOfMonth();
            $endDate = Carbon::now()->subMonth()->endOfMonth();
        } elseif ($period == 'this_year') {
            $startDate = Carbon::now()->startOfYear();
            $endDate = Carbon::now()->endOfYear();
        }

        // Sales Metrics
        $totalRevenue = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 4) // Not cancelled
            ->sum('grand_total');

        $totalOrders = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 4)
            ->count();

        $posSales = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('is_pos_order', 1)
            ->where('status', '!=', 4)
            ->sum('grand_total');

        $onlineSales = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('is_pos_order', 0)
            ->where('status', '!=', 4)
            ->sum('grand_total');

        // Top Selling Products
        $topProducts = OrderDetails::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate, $endDate])
            ->where('orders.status', '!=', 4)
            ->select('item_id', 'item_name', DB::raw('SUM(qty) as total_qty'), DB::raw('SUM(price * qty) as total_revenue'))
            ->groupBy('item_id', 'item_name')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        // Daily Sales for Chart
        $salesChartData = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 4)
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(grand_total) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return view('admin.analytics.dashboard', compact(
            'totalRevenue', 'totalOrders', 'posSales', 'onlineSales',
            'topProducts', 'salesChartData', 'period', 'startDate', 'endDate'
        ));
    }

    public function salesReport(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $orders = Order::with('user_info')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->orderByDesc('created_at')
            ->paginate(20);

        return view('admin.analytics.sales_report', compact('orders', 'startDate', 'endDate'));
    }

    public function productReport(Request $request)
    {
        $startDate = $request->get('start_date', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->endOfMonth()->format('Y-m-d'));

        $products = OrderDetails::join('orders', 'order_details.order_id', '=', 'orders.id')
            ->whereBetween('orders.created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
            ->where('orders.status', '!=', 4)
            ->select('item_id', 'item_name', DB::raw('SUM(qty) as total_sold'), DB::raw('SUM(price * qty) as total_revenue'))
            ->groupBy('item_id', 'item_name')
            ->orderByDesc('total_sold')
            ->paginate(20);

        return view('admin.analytics.product_report', compact('products', 'startDate', 'endDate'));
    }
}
