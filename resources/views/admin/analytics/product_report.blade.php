@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-box me-2"></i>Product Performance</h5>
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
                                <th>#</th>
                                <th>Product Name</th>
                                <th class="text-end">Units Sold</th>
                                <th class="text-end">Total Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($products as $key => $product)
                            <tr>
                                <td>{{ $products->firstItem() + $key }}</td>
                                <td><strong>{{ $product->item_name }}</strong></td>
                                <td class="text-end"><span class="badge bg-secondary">{{ $product->total_sold }}</span></td>
                                <td class="text-end text-success fw-bold">{{ helper::currency_format($product->total_revenue) }}</td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="4" class="text-center py-4 text-muted">No products sold in this period.</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $products->appends(request()->query())->links() }}
            </div>
        </div>
    </div>
@endsection
