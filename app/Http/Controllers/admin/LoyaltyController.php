<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class LoyaltyController extends Controller
{
    public function index(Request $request)
    {
        // Get all customers (type = 2)
        $customers = User::where('type', 2)
            ->orderByDesc('loyalty_points')
            ->paginate(10);
            
        return view('admin.loyalty.index', compact('customers'));
    }

    public function adjustPoints(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'points' => 'required|numeric',
            'action' => 'required|in:add,deduct'
        ]);

        $customer = User::findOrFail($request->user_id);
        
        // Initialize if null
        if (!isset($customer->loyalty_points)) {
            $customer->loyalty_points = 0;
        }

        if ($request->action == 'add') {
            $customer->loyalty_points += $request->points;
        } else {
            $customer->loyalty_points -= $request->points;
            if ($customer->loyalty_points < 0) {
                $customer->loyalty_points = 0;
            }
        }

        // Update tier based on points
        $customer->loyalty_tier = $this->calculateTier($customer->loyalty_points);
        $customer->save();

        return redirect()->back()->with('success', 'Loyalty points adjusted successfully!');
    }

    private function calculateTier($points)
    {
        if ($points >= 10000) return 'Platinum';
        if ($points >= 5000) return 'Gold';
        if ($points >= 1000) return 'Silver';
        return 'Bronze';
    }
}
