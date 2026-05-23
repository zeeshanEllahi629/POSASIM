@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <!-- Purchase Header -->
        <div class="row mb-3">
            <div class="col-12">
                <div class="card border-0 box-shadow">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0"><i class="fa fa-file-invoice me-2"></i>Purchase #{{ $purchase->reference_no }}</h5>
                            <a href="{{ url('admin/purchase') }}" class="btn btn-sm btn-outline-secondary"><i class="fa fa-arrow-left me-1"></i> Back</a>
                        </div>

                        <div class="row">
                            <div class="col-md-3">
                                <small class="text-muted">Supplier</small>
                                <p class="fw-bold mb-2">{{ @$purchase->supplier_info->name ?? '-' }}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Date</small>
                                <p class="fw-bold mb-2">{{ $purchase->created_at ? $purchase->created_at->format('d M Y, H:i') : '-' }}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Payment Method</small>
                                <p class="fw-bold mb-2">{{ ucfirst(str_replace('_', ' ', $purchase->payment_method ?? 'N/A')) }}</p>
                            </div>
                            <div class="col-md-3">
                                <small class="text-muted">Payment Status</small>
                                <p class="mb-2">
                                    @if($purchase->payment_status == 'paid')<span class="badge bg-success fs-6">Paid</span>
                                    @elseif($purchase->payment_status == 'partial')<span class="badge bg-warning text-dark fs-6">Partial</span>
                                    @else<span class="badge bg-danger fs-6">Unpaid</span>@endif
                                </p>
                            </div>
                        </div>
                        @if($purchase->notes)
                        <div class="mt-2 p-2 bg-light rounded">
                            <small class="text-muted">Notes:</small> {{ $purchase->notes }}
                        </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>

        <!-- Purchase Items -->
        <div class="row mb-3">
            <div class="col-lg-8">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <h6 class="fw-bold border-bottom pb-3 mb-3">Items</h6>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead>
                                    <tr><th>#</th><th>Item</th><th>Quantity</th><th>Cost Price</th><th>Total</th></tr>
                                </thead>
                                <tbody>
                                    @foreach($purchaseItems as $key => $item)
                                    <tr>
                                        <td>{{ $key + 1 }}</td>
                                        <td><strong>{{ @$item->product_info->item_name ?? 'Item #'.$item->product_id }}</strong></td>
                                        <td>{{ $item->quantity }}</td>
                                        <td>{{ helper::currency_format($item->cost_price) }}</td>
                                        <td class="fw-bold">{{ helper::currency_format($item->total) }}</td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <h6 class="fw-bold border-bottom pb-3 mb-3">Summary</h6>
                        <table class="table table-borderless">
                            <tr><td class="text-muted">Subtotal</td><td class="text-end fw-bold">{{ helper::currency_format($purchase->total_amount) }}</td></tr>
                            <tr><td class="text-muted">Discount</td><td class="text-end">-{{ helper::currency_format($purchase->discount_amount) }}</td></tr>
                            <tr><td class="text-muted">Tax</td><td class="text-end">+{{ helper::currency_format($purchase->tax_amount) }}</td></tr>
                            <tr class="border-top"><td class="fw-bold fs-5">Grand Total</td><td class="text-end fw-bold fs-5 text-primary">{{ helper::currency_format($purchase->grand_total) }}</td></tr>
                        </table>

                        <!-- Update Payment Status -->
                        @if($purchase->payment_status != 'paid')
                        <hr>
                        <form action="{{ url('admin/purchase/update-payment/'.$purchase->id) }}" method="POST">
                            @csrf
                            <label class="form-label fw-bold">Update Payment Status</label>
                            <select name="payment_status" class="form-select mb-2">
                                <option value="unpaid" {{ $purchase->payment_status == 'unpaid' ? 'selected' : '' }}>Unpaid</option>
                                <option value="partial" {{ $purchase->payment_status == 'partial' ? 'selected' : '' }}>Partial</option>
                                <option value="paid" {{ $purchase->payment_status == 'paid' ? 'selected' : '' }}>Paid</option>
                            </select>
                            <button type="submit" class="btn btn-primary btn-sm w-100"><i class="fa fa-save me-1"></i> Update</button>
                        </form>
                        @endif

                        <hr>
                        <small class="text-muted">Created by: {{ @$purchase->creator->name ?? 'N/A' }}</small>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
