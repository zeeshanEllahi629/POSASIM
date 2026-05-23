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
                        <option value="this_month" {{ $period == 'this_month' ? 'selected' : '' }}>This Month</option>
                        <option value="today" {{ $period == 'today' ? 'selected' : '' }}>Today</option>
                        <option value="this_year" {{ $period == 'this_year' ? 'selected' : '' }}>This Year</option>
                    </select>
                </form>
            </div>
        </div>

        <div class="row">
            <!-- Income Card -->
            <div class="col-md-4 mb-3">
                <div class="card border-0 box-shadow h-100 bg-success bg-opacity-10">
                    <div class="card-body text-center">
                        <i class="fa fa-arrow-down fs-1 text-success mb-2"></i>
                        <h5 class="card-title text-success">Total Income</h5>
                        <h3 class="fw-bold text-success mb-0">{{ helper::currency_format($totalIncome) }}</h3>
                        <small class="text-muted">From Sales & Orders</small>
                    </div>
                </div>
            </div>
            
            <!-- Outgoings Card -->
            <div class="col-md-4 mb-3">
                <div class="card border-0 box-shadow h-100 bg-danger bg-opacity-10">
                    <div class="card-body text-center">
                        <i class="fa fa-arrow-up fs-1 text-danger mb-2"></i>
                        <h5 class="card-title text-danger">Total Outgoings</h5>
                        <h3 class="fw-bold text-danger mb-0">{{ helper::currency_format($totalOutgoings) }}</h3>
                        <small class="text-muted">Expenses: {{ helper::currency_format($totalExpenses) }} | Purchases: {{ helper::currency_format($totalPurchases) }}</small>
                    </div>
                </div>
            </div>

            <!-- Net Profit Card -->
            <div class="col-md-4 mb-3">
                <div class="card border-0 box-shadow h-100 {{ $netProfit >= 0 ? 'bg-primary' : 'bg-secondary' }} bg-opacity-10">
                    <div class="card-body text-center">
                        <i class="fa fa-chart-line fs-1 {{ $netProfit >= 0 ? 'text-primary' : 'text-secondary' }} mb-2"></i>
                        <h5 class="card-title {{ $netProfit >= 0 ? 'text-primary' : 'text-secondary' }}">Net Profit</h5>
                        <h3 class="fw-bold {{ $netProfit >= 0 ? 'text-primary' : 'text-secondary' }} mb-0">{{ helper::currency_format($netProfit) }}</h3>
                        <small class="text-muted">Income - Outgoings</small>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <!-- Quick Links -->
            <div class="col-md-4 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <h5 class="card-title border-bottom pb-3 mb-3">Quick Actions</h5>
                        <div class="d-grid gap-2">
                            <a href="{{ url('admin/accounting/expenses') }}" class="btn btn-outline-danger"><i class="fa fa-minus-circle me-1"></i> Manage Expenses</a>
                            <a href="{{ url('admin/accounting/profit-loss') }}" class="btn btn-outline-primary"><i class="fa fa-file-invoice-dollar me-1"></i> Profit & Loss Report</a>
                            <a href="{{ url('admin/purchase') }}" class="btn btn-outline-secondary"><i class="fa fa-shopping-bag me-1"></i> Manage Purchases</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Expenses -->
            <div class="col-md-8 mb-3">
                <div class="card border-0 box-shadow h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0">Recent Expenses</h5>
                            <a href="{{ url('admin/accounting/expenses') }}" class="btn btn-sm btn-outline-primary">View All</a>
                        </div>
                        @if(count($recentExpenses) > 0)
                        <div class="table-responsive">
                            <table class="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th class="text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($recentExpenses as $expense)
                                    <tr>
                                        <td>{{ \Carbon\Carbon::parse($expense->expense_date)->format('d M Y') }}</td>
                                        <td><strong>{{ $expense->title }}</strong></td>
                                        <td><span class="badge bg-secondary">{{ $expense->category }}</span></td>
                                        <td class="text-end text-danger fw-bold">{{ helper::currency_format($expense->amount) }}</td>
                                    </tr>
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                        @else
                            <p class="text-muted text-center py-4">No recent expenses.</p>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
