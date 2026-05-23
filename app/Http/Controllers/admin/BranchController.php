<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Branch;
use App\Models\User;

class BranchController extends Controller
{
    public function index(Request $request)
    {
        $branches = Branch::with('manager')->paginate(10);
        return view('admin.branch.index', compact('branches'));
    }

    public function add(Request $request)
    {
        $managers = User::where('type', 1)->get(); // Assuming type 1 is Employee/Admin
        return view('admin.branch.add', compact('managers'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'manager_id' => 'nullable|exists:users,id',
            'status' => 'required|integer|in:0,1'
        ]);

        $branch = new Branch();
        $branch->name = $request->name;
        $branch->phone = $request->phone;
        $branch->email = $request->email;
        $branch->address = $request->address;
        $branch->manager_id = $request->manager_id;
        $branch->status = $request->status;
        $branch->save();

        return redirect('admin/branch')->with('success', 'Branch created successfully!');
    }

    public function edit($id)
    {
        $branch = Branch::findOrFail($id);
        $managers = User::where('type', 1)->get();
        return view('admin.branch.edit', compact('branch', 'managers'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'manager_id' => 'nullable|exists:users,id',
            'status' => 'required|integer|in:0,1'
        ]);

        $branch = Branch::findOrFail($id);
        $branch->name = $request->name;
        $branch->phone = $request->phone;
        $branch->email = $request->email;
        $branch->address = $request->address;
        $branch->manager_id = $request->manager_id;
        $branch->status = $request->status;
        $branch->save();

        return redirect('admin/branch')->with('success', 'Branch updated successfully!');
    }

    public function status(Request $request)
    {
        $branch = Branch::findOrFail($request->id);
        $branch->status = $request->status;
        $branch->save();
        return response()->json(['status' => 1, 'message' => 'Status updated successfully']);
    }

    public function delete(Request $request)
    {
        $branch = Branch::findOrFail($request->id);
        $branch->delete();
        return redirect()->back()->with('success', 'Branch deleted successfully!');
    }
}
