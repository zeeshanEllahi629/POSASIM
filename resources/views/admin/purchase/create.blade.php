@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-plus-circle me-2"></i>Create Purchase Order</h5>
                    <a href="{{ url('admin/purchase') }}" class="btn btn-sm btn-outline-secondary"><i class="fa fa-arrow-left me-1"></i> Back</a>
                </div>

                <form action="{{ url('admin/purchase/store') }}" method="POST" id="purchase-form">
                    @csrf
                    <div class="row mb-4">
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Supplier <span class="text-danger">*</span></label>
                            <select name="supplier_id" class="form-select" required>
                                <option value="">Select Supplier</option>
                                @foreach($suppliers as $supplier)
                                    <option value="{{ $supplier->id }}">{{ $supplier->name }} {{ $supplier->company ? '('.$supplier->company.')' : '' }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Payment Method</label>
                            <select name="payment_method" class="form-select">
                                <option value="cash">Cash</option>
                                <option value="bank_transfer">Bank Transfer</option>
                                <option value="cheque">Cheque</option>
                                <option value="credit">Credit</option>
                            </select>
                        </div>
                        <div class="col-md-4 mb-3">
                            <label class="form-label">Payment Status</label>
                            <select name="payment_status" class="form-select">
                                <option value="unpaid">Unpaid</option>
                                <option value="partial">Partial</option>
                                <option value="paid">Paid</option>
                            </select>
                        </div>
                    </div>

                    <!-- Items Table -->
                    <h6 class="fw-bold mb-3"><i class="fa fa-box me-1"></i> Purchase Items</h6>
                    <div class="table-responsive mb-3">
                        <table class="table table-bordered" id="items-table">
                            <thead class="table-light">
                                <tr>
                                    <th style="width:35%">Item</th>
                                    <th style="width:15%">Quantity</th>
                                    <th style="width:15%">Cost Price</th>
                                    <th style="width:15%">Total</th>
                                    <th style="width:10%"></th>
                                </tr>
                            </thead>
                            <tbody id="items-body">
                                <tr class="item-row" data-row="0">
                                    <td>
                                        <select name="items[0][product_id]" class="form-select item-select" required>
                                            <option value="">Select Item</option>
                                            @foreach($items as $item)
                                                <option value="{{ $item->id }}" data-price="{{ $item->price }}">{{ $item->item_name }}</option>
                                            @endforeach
                                        </select>
                                    </td>
                                    <td><input type="number" name="items[0][quantity]" class="form-control item-qty" value="1" min="1" step="0.01" required></td>
                                    <td><input type="number" name="items[0][cost_price]" class="form-control item-cost" value="0" min="0" step="0.01" required></td>
                                    <td><input type="text" class="form-control item-total" value="0.00" readonly></td>
                                    <td><button type="button" class="btn btn-sm btn-outline-danger remove-row" disabled><i class="fa fa-trash"></i></button></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <button type="button" class="btn btn-sm btn-outline-primary mb-4" id="add-row"><i class="fa fa-plus me-1"></i> Add Item</button>

                    <!-- Totals -->
                    <div class="row justify-content-end">
                        <div class="col-md-5">
                            <table class="table table-borderless">
                                <tr><td class="text-muted">Subtotal</td><td class="text-end"><strong id="subtotal">0.00</strong><input type="hidden" name="total_amount" id="total_amount_input" value="0"></td></tr>
                                <tr><td class="text-muted">Discount</td><td class="text-end"><input type="number" name="discount_amount" class="form-control form-control-sm text-end" id="discount-input" value="0" min="0" step="0.01" style="max-width:120px;display:inline-block"></td></tr>
                                <tr><td class="text-muted">Tax</td><td class="text-end"><input type="number" name="tax_amount" class="form-control form-control-sm text-end" id="tax-input" value="0" min="0" step="0.01" style="max-width:120px;display:inline-block"></td></tr>
                                <tr class="border-top"><td class="fw-bold fs-5">Grand Total</td><td class="text-end fw-bold fs-5 text-primary" id="grand-total">0.00<input type="hidden" name="grand_total" id="grand_total_input" value="0"></td></tr>
                            </table>
                        </div>
                    </div>

                    <!-- Notes -->
                    <div class="mb-4">
                        <label class="form-label">Notes</label>
                        <textarea name="notes" class="form-control" rows="2" placeholder="Purchase notes..."></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg"><i class="fa fa-save me-1"></i> Save Purchase Order</button>
                </form>
            </div>
        </div>
    </div>
@endsection
@section('script')
<script>
$(document).ready(function() {
    let rowIndex = 1;

    // Add row
    $('#add-row').on('click', function() {
        const row = `<tr class="item-row" data-row="${rowIndex}">
            <td><select name="items[${rowIndex}][product_id]" class="form-select item-select" required>
                <option value="">Select Item</option>
                @foreach($items as $item)
                    <option value="{{ $item->id }}" data-price="{{ $item->price }}">{{ $item->item_name }}</option>
                @endforeach
            </select></td>
            <td><input type="number" name="items[${rowIndex}][quantity]" class="form-control item-qty" value="1" min="1" step="0.01" required></td>
            <td><input type="number" name="items[${rowIndex}][cost_price]" class="form-control item-cost" value="0" min="0" step="0.01" required></td>
            <td><input type="text" class="form-control item-total" value="0.00" readonly></td>
            <td><button type="button" class="btn btn-sm btn-outline-danger remove-row"><i class="fa fa-trash"></i></button></td>
        </tr>`;
        $('#items-body').append(row);
        rowIndex++;
        updateRemoveButtons();
    });

    // Remove row
    $(document).on('click', '.remove-row', function() {
        $(this).closest('.item-row').remove();
        updateRemoveButtons();
        calculateTotals();
    });

    // Auto-fill cost price when item selected
    $(document).on('change', '.item-select', function() {
        const price = $(this).find(':selected').data('price') || 0;
        const row = $(this).closest('.item-row');
        row.find('.item-cost').val(parseFloat(price).toFixed(2));
        calculateRowTotal(row);
    });

    // Calculate on qty/cost change
    $(document).on('input', '.item-qty, .item-cost', function() {
        calculateRowTotal($(this).closest('.item-row'));
    });

    // Discount/tax change
    $('#discount-input, #tax-input').on('input', calculateTotals);

    function calculateRowTotal(row) {
        const qty = parseFloat(row.find('.item-qty').val()) || 0;
        const cost = parseFloat(row.find('.item-cost').val()) || 0;
        const total = qty * cost;
        row.find('.item-total').val(total.toFixed(2));
        calculateTotals();
    }

    function calculateTotals() {
        let subtotal = 0;
        $('.item-total').each(function() { subtotal += parseFloat($(this).val()) || 0; });
        const discount = parseFloat($('#discount-input').val()) || 0;
        const tax = parseFloat($('#tax-input').val()) || 0;
        const grandTotal = Math.max(0, subtotal - discount + tax);
        $('#subtotal').text(subtotal.toFixed(2));
        $('#total_amount_input').val(subtotal.toFixed(2));
        $('#grand-total').html(grandTotal.toFixed(2) + '<input type="hidden" name="grand_total" id="grand_total_input" value="' + grandTotal.toFixed(2) + '">');
    }

    function updateRemoveButtons() {
        const rows = $('.item-row');
        rows.find('.remove-row').prop('disabled', rows.length <= 1);
    }
});
</script>
@endsection
