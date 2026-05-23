<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Expense;
use App\Models\Order;
use App\Models\Purchase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AccountingController extends Controller
{
    public function dashboard(Request $request)
    {
        $period = $request->get('period', 'this_month');
        
        $startDate = Carbon::now()->startOfMonth();
        $endDate = Carbon::now()->endOfMonth();

        if ($period == 'today') {
            $startDate = Carbon::today();
            $endDate = Carbon::today()->endOfDay();
        } elseif ($period == 'this_year') {
            $startDate = Carbon::now()->startOfYear();
            $endDate = Carbon::now()->endOfYear();
        }

        // Total Income (Sales)
        $totalIncome = Order::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 4)
            ->sum('grand_total');

        // Total Expenses (Expenses table)
        $totalExpenses = Expense::whereBetween('expense_date', [$startDate, $endDate])
            ->sum('amount');

        // Total Purchase Costs
        $totalPurchases = Purchase::whereBetween('created_at', [$startDate, $endDate])
            ->sum('grand_total');

        $totalOutgoings = $totalExpenses + $totalPurchases;
        $netProfit = $totalIncome - $totalOutgoings;

        // Recent Expenses
        $recentExpenses = Expense::whereBetween('expense_date', [$startDate, $endDate])
            ->orderByDesc('expense_date')
            ->limit(10)
            ->get();

        return view('admin.accounting.dashboard', compact(
            'totalIncome', 'totalExpenses', 'totalPurchases', 
            'totalOutgoings', 'netProfit', 'recentExpenses', 'period'
        ));
    }

    public function expenses(Request $request)
    {
        $expenses = Expense::with('creator')->orderByDesc('expense_date')->paginate(20);
        return view('admin.accounting.expenses', compact('expenses'));
    }

    public function storeExpense(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|max:100',
            'expense_date' => 'required|date',
            'description' => 'nullable|string'
        ]);

        $expense = new Expense();
        $expense->title = $request->title;
        $expense->amount = $request->amount;
        $expense->category = $request->category;
        $expense->expense_date = $request->expense_date;
        $expense->description = $request->description;
        $expense->created_by = Auth::id();
        
        if ($request->hasFile('receipt')) {
            $imageName = time() . '.' . $request->receipt->extension();
            $request->receipt->move(public_path('admin-assets/images/expenses'), $imageName);
            $expense->receipt_image = $imageName;
        }
        
        $expense->save();

        return redirect()->back()->with('success', 'Expense recorded successfully!');
    }

    public function profitLoss(Request $request)
    {
        $year = $request->get('year', date('Y'));
        
        $monthlyData = [];
        for ($i = 1; $i <= 12; $i++) {
            $startDate = Carbon::create($year, $i, 1)->startOfMonth();
            $endDate = Carbon::create($year, $i, 1)->endOfMonth();

            $income = Order::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', '!=', 4)
                ->sum('grand_total');

            $expenses = Expense::whereBetween('expense_date', [$startDate, $endDate])->sum('amount');
            $purchases = Purchase::whereBetween('created_at', [$startDate, $endDate])->sum('grand_total');
            
            $outgoings = $expenses + $purchases;
            
            $monthlyData[$i] = [
                'month' => $startDate->format('M'),
                'income' => $income,
                'expenses' => $outgoings,
                'profit' => $income - $outgoings
            ];
        }

        return view('admin.accounting.profit_loss', compact('monthlyData', 'year'));
    }
}
