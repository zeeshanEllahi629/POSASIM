@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0">Adjust Stock — {{ $item->item_name }}</h5>
                    <a href="{{ url('admin/inventory/stock') }}" class="btn btn-sm btn-outline-secondary"><i class="fa fa-arrow-left me-1"></i> Back</a>
                </div>

                <!-- Item Info -->
                <div class="row mb-4">
                    <div class="col-auto">
                        @if($item->image)
                            <img src="{{ url(env('ASSETSPATHURL').'admin-assets/images/item/').'/'.$item->image }}" width="100" height="100" class="rounded" style="object-fit:cover">
                        @endif
                    </div>
                    <div class="col">
                        <h5>{{ $item->item_name }}</h5>
                        <p class="text-muted mb-1">Category: {{ @$item->category_info->category_name ?? '-' }}</p>
                        <p class="text-muted mb-0">Price: {{ helper::currency_format($item->price) }}</p>
                    </div>
                </div>

                <form action="{{ url('admin/inventory/adjust/'.$item->id) }}" method="POST">
                    @csrf
                    <!-- Adjustment Type -->
                    <div class="mb-4">
                        <label class="form-label fw-bold">Adjustment Type</label>
                        <div class="d-flex gap-3">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="adjustment_type" value="set" id="type_set" checked>
                                <label class="form-check-label" for="type_set">Set Stock (Replace)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="adjustment_type" value="add" id="type_add">
                                <label class="form-check-label text-success" for="type_add"><i class="fa fa-plus-circle"></i> Add Stock</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="adjustment_type" value="remove" id="type_remove">
                                <label class="form-check-label text-danger" for="type_remove"><i class="fa fa-minus-circle"></i> Remove Stock</label>
                            </div>
                        </div>
                    </div>

                    @if($item->has_variation == 1)
                        <!-- Variation Stock -->
                        <div class="table-responsive mb-4">
                            <table class="table table-bordered align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>Variation</th>
                                        <th>Current Qty</th>
                                        <th>Low Stock Threshold</th>
                                        <th>Stock Managed</th>
                                        <th>New Qty / Adjustment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($variations as $var)
                                    <tr>
                                        <td><strong>{{ $var->name }}</strong></td>
                                        <td>
                                            <span class="badge {{ $var->qty <= 0 ? 'bg-danger' : ($var->qty <= $var->low_qty ? 'bg-warning text-dark' : 'bg-success') }} fs-6">
                                                {{ $var->qty }}
                                            </span>
                                        </td>
                                        <td>{{ $var->low_qty }}</td>
                                        <td>
                                            @if($var->stock_management == 1)
                                                <span class="badge bg-success">Yes</span>
                                            @else
                                                <span class="badge bg-secondary">No</span>
                                            @endif
                                        </td>
                                        <td>
                                            <input type="number" name="variation_qty[{{ $var->id }}]" class="form-control" value="{{ $var->qty }}" min="0" style="max-width:120px">
                                        </td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    @else
                        <!-- Simple Stock -->
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <label class="form-label">Current Stock</label>
                                <p class="fs-4 fw-bold">{{ $variations->first()->qty ?? 0 }}</p>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label">Quantity</label>
                                <input type="number" name="stock_qty" class="form-control" value="{{ $variations->first()->qty ?? 0 }}" min="0">
                            </div>
                        </div>
                    @endif

                    <!-- Reason -->
                    <div class="mb-4">
                        <label class="form-label">Reason / Notes</label>
                        <textarea name="reason" class="form-control" rows="3" placeholder="Reason for stock adjustment..."></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary"><i class="fa fa-save me-1"></i> Save Adjustment</button>
                </form>
            </div>
        </div>
    </div>
@endsection
