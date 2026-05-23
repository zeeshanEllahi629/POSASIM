@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-truck me-2"></i>Suppliers</h5>
                    <a href="{{ url('admin/supplier/add') }}" class="btn btn-primary"><i class="fa fa-plus me-1"></i> Add Supplier</a>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Purchases</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($suppliers as $key => $supplier)
                            <tr>
                                <td>{{ $suppliers->firstItem() + $key }}</td>
                                <td><strong>{{ $supplier->name }}</strong></td>
                                <td>{{ $supplier->phone ?? '-' }}</td>
                                <td>{{ $supplier->email ?? '-' }}</td>
                                <td>{{ $supplier->company ?? '-' }}</td>
                                <td><span class="badge bg-info">{{ $supplier->purchase_count }}</span></td>
                                <td>{{ helper::currency_format($supplier->total_purchases) }}</td>
                                <td>
                                    <a href="{{ url('admin/supplier/status?id='.$supplier->id) }}" class="badge {{ $supplier->status == 1 ? 'bg-success' : 'bg-danger' }}" style="cursor:pointer">
                                        {{ $supplier->status == 1 ? 'Active' : 'Inactive' }}
                                    </a>
                                </td>
                                <td>
                                    <div class="d-flex gap-1">
                                        <a href="{{ url('admin/supplier/details/'.$supplier->id) }}" class="btn btn-sm btn-outline-info" title="Details"><i class="fa fa-eye"></i></a>
                                        <a href="{{ url('admin/supplier/show/'.$supplier->id) }}" class="btn btn-sm btn-outline-primary" title="Edit"><i class="fa fa-edit"></i></a>
                                        <a href="{{ url('admin/supplier/delete?id='.$supplier->id) }}" class="btn btn-sm btn-outline-danger" title="Delete" onclick="return confirm('Delete this supplier?')"><i class="fa fa-trash"></i></a>
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="9" class="text-center py-4 text-muted">No suppliers found. <a href="{{ url('admin/supplier/add') }}">Add one</a></td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $suppliers->links() }}
            </div>
        </div>
    </div>
@endsection
