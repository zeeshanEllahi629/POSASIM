@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <!-- Date Filter -->
        <div class="card border-0 box-shadow mb-3">
            <div class="card-body">
                <form method="GET" class="d-flex align-items-center gap-3">
                    <label class="fw-bold mb-0">Select Period:</label>
                    <select name="period" class="form-select w-auto" onchange="this.form.submit()">
                        <option value="today" {{ $period == 'today' ? 'selected' : '' }}>Today</option>
                        <option value="this_week" {{ $period == 'this_week' ? 'selected' : '' }}>This Week</option>
                        <option value="this_month" {{ $period == 'this_month' ? 'selected' : '' }}>This Month</option>
                        <option value="last_month" {{ $period == 'last_month' ? 'selected' : '' }}>Last Month</option>
                        <option value="this_year" {{ $period == 'this_year' ? 'selected' : '' }}>This Year</option>
                    </select>
                    <span class="text-muted ms-auto"><i class="fa fa-calendar me-1"></i> {{ $startDate->format('d M Y') }} - {{ $endDate->format('d M Y') }}</span>
                </form>
            </div>
        </div>

        <div class="row">
            <!-- Stat Cards -->
            <div class="col-xl-3 col-lg-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-success bg-opacity-10"><i class="fa fa-dollar-sign fs-5 text-success"></i></span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">Total Revenue</p>
                                <h4>{{ helper::currency_format($totalRevenue) }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-info bg-opacity-10"><i class="fa fa-shopping-cart fs-5 text-info"></i></span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">Total Orders</p>
                                <h4>{{ $totalOrders }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-primary bg-opacity-10"><i class="fa fa-store fs-5 text-primary"></i></span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">POS Sales</p>
                                <h4>{{ helper::currency_format($posSales) }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-lg-6 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="dashboard-card">
                            <span class="card-icon bg-warning bg-opacity-10"><i class="fa fa-globe fs-5 text-warning"></i></span>
                            <span class="text-end">
                                <p class="fw-medium mb-1">Online Sales</p>
                                <h4>{{ helper::currency_format($onlineSales) }}</h4>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- Sales Chart -->
            <div class="col-lg-8 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3 mb-3">Sales Trend</h5>
                        <canvas id="salesChart" height="100"></canvas>
                    </div>
                </div>
            </div>

            <!-- Top Products -->
            <div class="col-lg-4 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0">Top Products</h5>
                            <a href="{{ url('admin/analytics/product-report') }}" class="btn btn-sm btn-outline-primary">View All</a>
                        </div>
                        @if(count($topProducts) > 0)
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead>
                                    <tr><th>Product</th><th class="text-end">Qty</th><th class="text-end">Revenue</th></tr>
                                </thead>
                                <tbody>
                                    @foreach($topProducts as $product)
                                    <tr>
                                        <td><strong>{{ $product->item_name }}</strong></td>
                                        <td class="text-end"><span class="badge bg-secondary">{{ $product->total_qty }}</span></td>
                                        <td class="text-end text-success fw-bold">{{ helper::currency_format($product->total_revenue) }}</td>
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
        </div>
    </div>
@endsection
@section('script')
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    const ctx = document.getElementById('salesChart').getContext('2d');
    const data = @json($salesChartData);
    const labels = data.map(item => item.date);
    const values = data.map(item => item.total);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue',
                data: values,
                borderColor: '#00b894',
                backgroundColor: 'rgba(0, 184, 148, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
</script>
@endsection
