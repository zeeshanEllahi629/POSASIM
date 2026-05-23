@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-bell text-warning me-2"></i>Inventory Alerts</h5>
                    <a href="{{ url('admin/inventory') }}" class="btn btn-sm btn-outline-primary"><i class="fa fa-arrow-left me-1"></i> Dashboard</a>
                </div>

                <!-- Tabs -->
                <ul class="nav nav-tabs mb-4" role="tablist">
                    <li class="nav-item"><a class="nav-link active" data-bs-toggle="tab" href="#low-stock"><i class="fa fa-exclamation-triangle text-warning me-1"></i> Low Stock ({{ $lowStockItems->total() }})</a></li>
                    <li class="nav-item"><a class="nav-link" data-bs-toggle="tab" href="#expiring"><i class="fa fa-clock text-danger me-1"></i> Expiring Soon ({{ $expiringItems->total() }})</a></li>
                </ul>

                <div class="tab-content">
                    <!-- Low Stock Tab -->
                    <div class="tab-pane fade show active" id="low-stock">
                        @if($lowStockItems->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead><tr><th>#</th><th>Item</th><th>Variation</th><th>Current Stock</th><th>Threshold</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    @foreach($lowStockItems as $key => $item)
                                    <tr>
                                        <td>{{ $lowStockItems->firstItem() + $key }}</td>
                                        <td><strong>{{ @$item->item_info->item_name ?? 'N/A' }}</strong><br><small class="text-muted">{{ @$item->item_info->category_info->category_name ?? '' }}</small></td>
                                        <td>{{ $item->name }}</td>
                                        <td><span class="fw-bold {{ $item->qty <= 0 ? 'text-danger' : 'text-warning' }}">{{ $item->qty }}</span></td>
                                        <td>{{ $item->low_qty }}</td>
                                        <td>@if($item->qty <= 0)<span class="badge bg-danger">Out</span>@else<span class="badge bg-warning text-dark">Low</span>@endif</td>
                                        <td><a href="{{ url('admin/inventory/adjust/'.$item->item_id) }}" class="btn btn-sm btn-outline-primary"><i class="fa fa-sliders"></i></a></td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        {{ $lowStockItems->links() }}
                        @else
                            <div class="text-center py-5 text-muted"><i class="fa fa-check-circle fa-3x mb-3 text-success"></i><p>All stock levels are healthy!</p></div>
                        @endif
                    </div>

                    <!-- Expiring Tab -->
                    <div class="tab-pane fade" id="expiring">
                        @if($expiringItems->count() > 0)
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead><tr><th>#</th><th>Item</th><th>Category</th><th>Expiry Date</th><th>Days Left</th><th>Status</th></tr></thead>
                                <tbody>
                                    @foreach($expiringItems as $key => $item)
                                    @php $daysLeft = now()->diffInDays($item->expiry_date, false); @endphp
                                    <tr class="{{ $daysLeft < 0 ? 'table-danger' : ($daysLeft <= 7 ? 'table-warning' : '') }}">
                                        <td>{{ $expiringItems->firstItem() + $key }}</td>
                                        <td><strong>{{ $item->item_name }}</strong></td>
                                        <td>{{ @$item->category_info->category_name ?? '-' }}</td>
                                        <td>{{ \Carbon\Carbon::parse($item->expiry_date)->format('d M Y') }}</td>
                                        <td>@if($daysLeft < 0)<span class="text-danger fw-bold">Expired</span>@else<span class="fw-bold">{{ $daysLeft }} days</span>@endif</td>
                                        <td>
                                            @if($daysLeft < 0)<span class="badge bg-danger">Expired</span>
                                            @elseif($daysLeft <= 7)<span class="badge bg-warning text-dark">Critical</span>
                                            @else<span class="badge bg-info">Expiring</span>@endif
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        {{ $expiringItems->links() }}
                        @else
                            <div class="text-center py-5 text-muted"><i class="fa fa-check-circle fa-3x mb-3 text-success"></i><p>No items expiring soon</p></div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
