<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalesAgent;
use App\Models\User;
use App\Models\Branch;

class SalesAgentController extends Controller
{
    public function index(Request $request)
    {
        $agents = SalesAgent::with(['user_info', 'branch'])->paginate(10);
        return view('admin.sales_agent.index', compact('agents'));
    }

    public function add()
    {
        $users = User::where('type', 1)->get(); // Select from existing users/employees
        $branches = Branch::where('status', 1)->get();
        return view('admin.sales_agent.add', compact('users', 'branches'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id|unique:sales_agents,user_id',
            'target_amount' => 'required|numeric|min:0',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'branch_id' => 'nullable|exists:branches,id',
            'status' => 'required|integer|in:0,1'
        ]);

        $agent = new SalesAgent();
        $agent->user_id = $request->user_id;
        $agent->target_amount = $request->target_amount;
        $agent->commission_rate = $request->commission_rate;
        $agent->branch_id = $request->branch_id;
        $agent->status = $request->status;
        $agent->save();

        return redirect('admin/sales-agents')->with('success', 'Sales agent assigned successfully!');
    }

    public function edit($id)
    {
        $agent = SalesAgent::findOrFail($id);
        $users = User::where('type', 1)->get();
        $branches = Branch::where('status', 1)->get();
        return view('admin.sales_agent.edit', compact('agent', 'users', 'branches'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'target_amount' => 'required|numeric|min:0',
            'commission_rate' => 'required|numeric|min:0|max:100',
            'branch_id' => 'nullable|exists:branches,id',
            'status' => 'required|integer|in:0,1'
        ]);

        $agent = SalesAgent::findOrFail($id);
        $agent->target_amount = $request->target_amount;
        $agent->commission_rate = $request->commission_rate;
        $agent->branch_id = $request->branch_id;
        $agent->status = $request->status;
        $agent->save();

        return redirect('admin/sales-agents')->with('success', 'Sales agent updated successfully!');
    }

    public function status(Request $request)
    {
        $agent = SalesAgent::findOrFail($request->id);
        $agent->status = $request->status;
        $agent->save();
        return response()->json(['status' => 1, 'message' => 'Status updated successfully']);
    }

    public function delete(Request $request)
    {
        $agent = SalesAgent::findOrFail($request->id);
        $agent->delete();
        return redirect()->back()->with('success', 'Sales agent removed successfully!');
    }
}
