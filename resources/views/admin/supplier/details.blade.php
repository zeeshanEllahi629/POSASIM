@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <!-- Supplier Info Card -->
        <div class="row mb-3">
            <div class="col-md-4">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3 mb-3"><i class="fa fa-truck me-2"></i>Supplier Info</h5>
                        <table class="table table-borderless mb-0">
                            <tr><td class="text-muted">Name</td><td><strong>{{ $supplier->name }}</strong></td></tr>
                            <tr><td class="text-muted">Company</td><td>{{ $supplier->company ?? '-' }}</td></tr>
                            <tr><td class="text-muted">Phone</td><td>{{ $supplier->phone ?? '-' }}</td></tr>
                            <tr><td class="text-muted">Email</td><td>{{ $supplier->email ?? '-' }}</td></tr>
                            <tr><td class="text-muted">Address</td><td>{{ $supplier->address ?? '-' }}</td></tr>
                            <tr><td class="text-muted">Status</td><td><span class="badge {{ $supplier->status == 1 ? 'bg-success' : 'bg-danger' }}">{{ $supplier->status == 1 ? 'Active' : 'Inactive' }}</span></td></tr>
                            <tr><td class="text-muted">Since</td><td>{{ $supplier->created_at ? $supplier->created_at->format('d M Y') : '-' }}</td></tr>
                        </table>
                        @if($supplier->notes)
                        <div class="mt-3 p-3 bg-light rounded">
                            <small class="text-muted">Notes:</small><br>
                            <small>{{ $supplier->notes }}</small>
                        </div>
                        @endif
                        <div class="mt-3">
                            <a href="{{ url('admin/supplier/show/'.$supplier->id) }}" class="btn btn-sm btn-primary"><i class="fa fa-edit"></i> Edit</a>
                            <a href="{{ url('admin/supplier') }}" class="btn btn-sm btn-outline-secondary"><i class="fa fa-arrow-left"></i> Back</a>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-8">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0">Purchase History</h5>
                            <span class="badge bg-info fs-6">{{ $purchases->total() }} purchases</span>
                        </div>
                        @if($purchases->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead><tr><th>Date</th><th>Reference</th><th>Grand Total</th><th>Payment</th><th>Action</th></tr></thead>
                                <tbody>
                                    @foreach($purchases as $purchase)
                                    <tr>
                                        <td>{{ $purchase->created_at ? $purchase->created_at->format('d M Y') : '-' }}</td>
                                        <td><strong>{{ $purchase->reference_no ?? '-' }}</strong></td>
                                        <td>{{ helper::currency_format($purchase->grand_total) }}</td>
                                        <td>
                                            @if($purchase->payment_status == 'paid')<span class="badge bg-success">Paid</span>
                                            @elseif($purchase->payment_status == 'partial')<span class="badge bg-warning text-dark">Partial</span>
                                            @else<span class="badge bg-danger">Unpaid</span>@endif
                                        </td>
                                        <td><a href="{{ url('admin/purchase/show/'.$purchase->id) }}" class="btn btn-sm btn-outline-info"><i class="fa fa-eye"></i></a></td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        {{ $purchases->links() }}
                        @else
                            <p class="text-muted text-center py-4">No purchases from this supplier yet</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
