@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-shopping-bag me-2"></i>Purchase Orders</h5>
                    <a href="{{ url('admin/purchase/create') }}" class="btn btn-primary"><i class="fa fa-plus me-1"></i> Create Purchase</a>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Reference</th>
                                <th>Supplier</th>
                                <th>Items</th>
                                <th>Grand Total</th>
                                <th>Payment Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($purchases as $key => $purchase)
                            <tr>
                                <td>{{ $purchases->firstItem() + $key }}</td>
                                <td><strong>{{ $purchase->reference_no ?? '-' }}</strong></td>
                                <td>{{ @$purchase->supplier_info->name ?? '-' }}</td>
                                <td><span class="badge bg-secondary">{{ $purchase->items_count ?? $purchase->items->count() }}</span></td>
                                <td class="fw-bold">{{ helper::currency_format($purchase->grand_total) }}</td>
                                <td>
                                    @if($purchase->payment_status == 'paid')<span class="badge bg-success">Paid</span>
                                    @elseif($purchase->payment_status == 'partial')<span class="badge bg-warning text-dark">Partial</span>
                                    @else<span class="badge bg-danger">Unpaid</span>@endif
                                </td>
                                <td>{{ $purchase->created_at ? $purchase->created_at->format('d M Y') : '-' }}</td>
                                <td>
                                    <div class="d-flex gap-1">
                                        <a href="{{ url('admin/purchase/show/'.$purchase->id) }}" class="btn btn-sm btn-outline-info" title="View"><i class="fa fa-eye"></i></a>
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="8" class="text-center py-4 text-muted">No purchases found. <a href="{{ url('admin/purchase/create') }}">Create one</a></td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $purchases->links() }}
            </div>
        </div>
    </div>
@endsection
