@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-file-invoice-dollar me-2"></i>Sales Report</h5>
                    <div>
                        <a href="#" class="btn btn-sm btn-outline-success"><i class="fa fa-file-excel me-1"></i> Export</a>
                        <a href="{{ url('admin/analytics') }}" class="btn btn-sm btn-outline-primary"><i class="fa fa-arrow-left me-1"></i> Dashboard</a>
                    </div>
                </div>

                <!-- Date Range Filter -->
                <form method="GET" class="row g-3 mb-4 align-items-end">
                    <div class="col-md-3">
                        <label class="form-label">Start Date</label>
                        <input type="date" name="start_date" class="form-control" value="{{ $startDate }}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">End Date</label>
                        <input type="date" name="end_date" class="form-control" value="{{ $endDate }}">
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100"><i class="fa fa-filter me-1"></i> Filter</button>
                    </div>
                </form>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th class="text-end">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($orders as $order)
                            <tr>
                                <td><strong>#{{ $order->order_number }}</strong></td>
                                <td>{{ $order->created_at->format('d M Y, H:i') }}</td>
                                <td>{{ @$order->user_info->name ?? 'Guest' }}</td>
                                <td>
                                    @if($order->is_pos_order)
                                        <span class="badge bg-primary">POS</span>
                                    @else
                                        <span class="badge bg-warning text-dark">Online</span>
                                    @endif
                                </td>
                                <td>
                                    @if($order->status == 1)<span class="badge bg-info">Placed</span>
                                    @elseif($order->status == 2)<span class="badge bg-warning">Processing</span>
                                    @elseif($order->status == 3)<span class="badge bg-success">Delivered</span>
                                    @elseif($order->status == 4)<span class="badge bg-danger">Cancelled</span>
                                    @elseif($order->status == 5)<span class="badge bg-success">Completed</span>
                                    @endif
                                </td>
                                <td class="text-end fw-bold">{{ helper::currency_format($order->grand_total) }}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">No sales found for this period.</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $orders->appends(request()->query())->links() }}
            </div>
        </div>
    </div>
@endsection
