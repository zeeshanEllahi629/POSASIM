@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="row">
            <!-- Stat Cards -->
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-primary bg-opacity-10">
                                <i class="fa fa-boxes-stacked fs-5 text-primary"></i>
                            </span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">Total Products</p>
                                <h4>{{ $totalProducts }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-success bg-opacity-10">
                                <i class="fa fa-check-circle fs-5 text-success"></i>
                            </span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">In Stock</p>
                                <h4>{{ $inStock }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-warning bg-opacity-10">
                                <i class="fa fa-exclamation-triangle fs-5 text-warning"></i>
                            </span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">Low Stock</p>
                                <h4>{{ $lowStockVariations }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-danger bg-opacity-10">
                                <i class="fa fa-times-circle fs-5 text-danger"></i>
                            </span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">Out of Stock</p>
                                <h4>{{ $outOfStock }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Low Stock Items Table -->
        <div class="row">
            <div class="col-lg-7 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0">Low Stock Items</h5>
                            <a href="{{ url('admin/inventory/alerts') }}" class="btn btn-sm btn-outline-warning">View All Alerts</a>
                        </div>
                        @if(count($lowStockItems) > 0)
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Variation</th>
                                        <th>Stock</th>
                                        <th>Threshold</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($lowStockItems as $item)
                                    <tr>
                                        <td>
                                            <strong>{{ @$item->item_info->item_name ?? 'N/A' }}</strong>
                                            <br><small class="text-muted">{{ @$item->item_info->category_info->category_name ?? '' }}</small>
                                        </td>
                                        <td>{{ $item->name }}</td>
                                        <td><span class="fw-bold text-warning">{{ $item->qty }}</span></td>
                                        <td>{{ $item->low_qty }}</td>
                                        <td>
                                            @if($item->qty <= 0)
                                                <span class="badge bg-danger">Out of Stock</span>
                                            @else
                                                <span class="badge bg-warning text-dark">Low Stock</span>
                                            @endif
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        @else
                            @include('admin.nodata')
                        @endif
                    </div>
                </div>
            </div>

            <!-- Expiring Items -->
            <div class="col-lg-5 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3 mb-3">
                            <i class="fa fa-clock text-danger me-2"></i>Expiring Soon
                        </h5>
                        @if(count($expiringItems) > 0)
                        <div class="list-group list-group-flush">
                            @foreach($expiringItems as $item)
                            <div class="list-group-item px-0 d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>{{ $item->item_name }}</strong>
                                    <br>
                                    @php $daysLeft = now()->diffInDays($item->expiry_date, false); @endphp
                                    @if($daysLeft < 0)
                                        <small class="text-danger"><i class="fa fa-exclamation-circle"></i> Expired {{ abs($daysLeft) }} days ago</small>
                                    @elseif($daysLeft <= 7)
                                        <small class="text-danger">Expires in {{ $daysLeft }} days</small>
                                    @else
                                        <small class="text-warning">Expires in {{ $daysLeft }} days</small>
                                    @endif
                                </div>
                                <span class="badge {{ $daysLeft < 0 ? 'bg-danger' : ($daysLeft <= 7 ? 'bg-warning text-dark' : 'bg-info') }}">
                                    {{ \Carbon\Carbon::parse($item->expiry_date)->format('d M Y') }}
                                </span>
                            </div>
                            @endforeach
                        </div>
                        @else
                            <p class="text-muted text-center py-4">No items expiring soon</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Links -->
        <div class="row mb-3">
            <div class="col-12">
                <div class="card border-0 box-shadow">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3 mb-3">Quick Actions</h5>
                        <div class="d-flex gap-2 flex-wrap">
                            <a href="{{ url('admin/inventory/stock') }}" class="btn btn-primary"><i class="fa fa-list me-1"></i> Stock List</a>
                            <a href="{{ url('admin/inventory/alerts') }}" class="btn btn-warning"><i class="fa fa-bell me-1"></i> Alerts</a>
                            <a href="{{ url('admin/inventory/history') }}" class="btn btn-info text-white"><i class="fa fa-history me-1"></i> History</a>
                            <a href="{{ url('admin/supplier') }}" class="btn btn-secondary"><i class="fa fa-truck me-1"></i> Suppliers</a>
                            <a href="{{ url('admin/purchase') }}" class="btn btn-dark"><i class="fa fa-shopping-bag me-1"></i> Purchases</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
