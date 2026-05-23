@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0">Stock Management</h5>
                    <a href="{{ url('admin/inventory') }}" class="btn btn-sm btn-outline-primary"><i class="fa fa-arrow-left me-1"></i> Back to Dashboard</a>
                </div>

                <!-- Filters -->
                <form method="GET" class="row g-3 mb-4">
                    <div class="col-md-3">
                        <select name="category_id" class="form-select">
                            <option value="">All Categories</option>
                            @foreach($categories as $cat)
                                <option value="{{ $cat->id }}" {{ request('category_id') == $cat->id ? 'selected' : '' }}>{{ $cat->category_name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="col-md-3">
                        <input type="text" name="search" class="form-control" placeholder="Search items..." value="{{ request('search') }}">
                    </div>
                    <div class="col-md-2">
                        <button type="submit" class="btn btn-primary w-100"><i class="fa fa-filter me-1"></i> Filter</button>
                    </div>
                    @if(request()->hasAny(['category_id', 'search']))
                    <div class="col-md-2">
                        <a href="{{ url('admin/inventory/stock') }}" class="btn btn-outline-secondary w-100">Clear</a>
                    </div>
                    @endif
                </form>

                <!-- Stock Table -->
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Image</th>
                                <th>Item Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock Qty</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($items as $key => $item)
                            <tr>
                                <td>{{ $items->firstItem() + $key }}</td>
                                <td>
                                    @if($item->image)
                                        <img src="{{ url(env('ASSETSPATHURL').'admin-assets/images/item/').'/'.$item->image }}" width="50" height="50" class="rounded" style="object-fit:cover">
                                    @else
                                        <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width:50px;height:50px"><i class="fa fa-image text-muted"></i></div>
                                    @endif
                                </td>
                                <td>
                                    <strong>{{ $item->item_name }}</strong>
                                    @if($item->has_variation == 1)
                                        <br><small class="text-muted">{{ $item->variations_list->count() }} variations</small>
                                    @endif
                                </td>
                                <td>{{ @$item->category_info->category_name ?? '-' }}</td>
                                <td>{{ helper::currency_format($item->price) }}</td>
                                <td>
                                    @if($item->has_variation == 1)
                                        @foreach($item->variations_list as $var)
                                            <div class="mb-1">
                                                <small class="text-muted">{{ $var->name }}:</small>
                                                <span class="fw-bold {{ $var->stock_management == 1 && $var->qty <= $var->low_qty ? ($var->qty <= 0 ? 'text-danger' : 'text-warning') : 'text-success' }}">
                                                    {{ $var->stock_management == 1 ? $var->qty : '∞' }}
                                                </span>
                                            </div>
                                        @endforeach
                                    @else
                                        <span class="fw-bold">{{ $item->total_stock }}</span>
                                    @endif
                                </td>
                                <td>
                                    @if($item->has_out_of_stock)
                                        <span class="badge bg-danger">Out of Stock</span>
                                    @elseif($item->has_low_stock)
                                        <span class="badge bg-warning text-dark">Low Stock</span>
                                    @else
                                        <span class="badge bg-success">In Stock</span>
                                    @endif
                                </td>
                                <td>
                                    <a href="{{ url('admin/inventory/adjust/'.$item->id) }}" class="btn btn-sm btn-outline-primary">
                                        <i class="fa fa-sliders me-1"></i> Adjust
                                    </a>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="8" class="text-center py-4 text-muted">No items found</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $items->appends(request()->query())->links() }}
            </div>
        </div>
    </div>
@endsection
