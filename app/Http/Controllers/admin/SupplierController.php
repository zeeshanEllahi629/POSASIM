<?php

namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Supplier;
use App\Models\Purchase;
use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::where('status', '!=', 0)->orderByDesc('id')->paginate(20);
        return view('admin.supplier.index', compact('suppliers'));
    }

    public function add()
    {
        return view('admin.supplier.add');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $supplier = new Supplier;
        $supplier->name = $request->name;
        $supplier->phone = $request->phone;
        $supplier->email = $request->email;
        $supplier->address = $request->address;
        $supplier->company = $request->company;
        $supplier->notes = $request->notes;
        $supplier->status = 1;
        $supplier->save();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'create',
            'module' => 'supplier',
            'description' => 'Created supplier: ' . $supplier->name,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect('admin/suppliers')->with('success', trans('messages.success'));
    }

    public function show($id)
    {
        $supplier = Supplier::where('id', $id)->first();
        if (!$supplier) {
            return redirect('admin/suppliers')->with('error', 'Supplier not found.');
        }
        return view('admin.supplier.edit', compact('supplier'));
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'company' => 'nullable|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $supplier = Supplier::find($id);
        if (!$supplier) {
            return redirect('admin/suppliers')->with('error', 'Supplier not found.');
        }

        $supplier->name = $request->name;
        $supplier->phone = $request->phone;
        $supplier->email = $request->email;
        $supplier->address = $request->address;
        $supplier->company = $request->company;
        $supplier->notes = $request->notes;
        $supplier->save();

        ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => 'update',
            'module' => 'supplier',
            'description' => 'Updated supplier: ' . $supplier->name,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect('admin/suppliers')->with('success', trans('messages.success'));
    }

    public function delete(Request $request)
    {
        $supplier = Supplier::where('id', $request->id)->update(['status' => 0]);
        if ($supplier) {
            return 1;
        } else {
            return 0;
        }
    }

    public function status(Request $request)
    {
        $supplier = Supplier::where('id', $request->id)->update(['status' => $request->status]);
        if ($supplier) {
            return 1;
        } else {
            return 0;
        }
    }

    public function details($id)
    {
        $supplier = Supplier::where('id', $id)->first();
        if (!$supplier) {
            return redirect('admin/suppliers')->with('error', 'Supplier not found.');
        }
        $purchases = Purchase::with('supplier_info')->where('supplier_id', $id)->orderByDesc('id')->paginate(20);
        return view('admin.supplier.details', compact('supplier', 'purchases'));
    }
}
