@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="row">
            <!-- Add Expense Form -->
            <div class="col-lg-4 mb-4">
                <div class="card border-0 box-shadow">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3 mb-3"><i class="fa fa-plus-circle me-2"></i>Record Expense</h5>
                        <form action="{{ url('admin/accounting/expenses/store') }}" method="POST" enctype="multipart/form-data">
                            @csrf
                            <div class="mb-3">
                                <label class="form-label">Title / Reference <span class="text-danger">*</span></label>
                                <input type="text" name="title" class="form-control" required placeholder="e.g. Office Rent">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Amount <span class="text-danger">*</span></label>
                                <input type="number" name="amount" class="form-control" required min="0" step="0.01">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Category <span class="text-danger">*</span></label>
                                <select name="category" class="form-select" required>
                                    <option value="">Select Category</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Salaries">Salaries & Wages</option>
                                    <option value="Marketing">Marketing & Advertising</option>
                                    <option value="Maintenance">Maintenance & Repairs</option>
                                    <option value="Supplies">Office Supplies</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Date <span class="text-danger">*</span></label>
                                <input type="date" name="expense_date" class="form-control" required value="{{ date('Y-m-d') }}">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Description (Optional)</label>
                                <textarea name="description" class="form-control" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Receipt Image (Optional)</label>
                                <input type="file" name="receipt" class="form-control" accept="image/*">
                            </div>
                            <button type="submit" class="btn btn-primary w-100"><i class="fa fa-save me-1"></i> Save Expense</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Expense List -->
            <div class="col-lg-8 mb-4">
                <div class="card border-0 box-shadow">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0"><i class="fa fa-list me-2"></i>Expense History</h5>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th>Date</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Recorded By</th>
                                        <th>Receipt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @forelse($expenses as $expense)
                                    <tr>
                                        <td>{{ \Carbon\Carbon::parse($expense->expense_date)->format('d M Y') }}</td>
                                        <td>
                                            <strong>{{ $expense->title }}</strong>
                                            @if($expense->description)
                                                <br><small class="text-muted">{{ Str::limit($expense->description, 30) }}</small>
                                            @endif
                                        </td>
                                        <td><span class="badge bg-secondary">{{ $expense->category }}</span></td>
                                        <td class="fw-bold text-danger">{{ helper::currency_format($expense->amount) }}</td>
                                        <td>{{ @$expense->creator->name ?? 'System' }}</td>
                                        <td>
                                            @if($expense->receipt_image)
                                                <a href="{{ asset('admin-assets/images/expenses/'.$expense->receipt_image) }}" target="_blank" class="btn btn-sm btn-outline-info"><i class="fa fa-image"></i> View</a>
                                            @else
                                                <span class="text-muted">-</span>
                                            @endif
                                        </td>
                                    </tr>
                                    @empty
                                    <tr>
                                        <td colspan="6" class="text-center py-4 text-muted">No expenses recorded yet.</td>
                                    </tr>
                                    @endforelse
                                </tbody>
                            </table>
                        </div>
                        {{ $expenses->links() }}
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
