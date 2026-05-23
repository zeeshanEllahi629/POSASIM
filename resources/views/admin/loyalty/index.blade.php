@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-gift me-2"></i>Customer Loyalty Program</h5>
                    <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#adjustPointsModal"><i class="fa fa-plus me-1"></i> Adjust Points</button>
                </div>

                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card bg-light border-0">
                            <div class="card-body text-center">
                                <h6 class="text-muted">Bronze Tier</h6>
                                <h4>0 - 999</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-light border-0">
                            <div class="card-body text-center">
                                <h6 class="text-secondary">Silver Tier</h6>
                                <h4>1,000+</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-light border-0">
                            <div class="card-body text-center">
                                <h6 class="text-warning">Gold Tier</h6>
                                <h4>5,000+</h4>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card bg-light border-0">
                            <div class="card-body text-center">
                                <h6 class="text-info">Platinum Tier</h6>
                                <h4>10,000+</h4>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Customer Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th class="text-center">Total Points</th>
                                <th class="text-center">Current Tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($customers as $customer)
                            <tr>
                                <td><strong>{{ $customer->name }}</strong></td>
                                <td>{{ $customer->email }}</td>
                                <td>{{ $customer->mobile ?? '-' }}</td>
                                <td class="text-center fw-bold text-success">{{ number_format($customer->loyalty_points ?? 0) }}</td>
                                <td class="text-center">
                                    @php
                                        $tier = $customer->loyalty_tier ?? 'Bronze';
                                        $badgeClass = 'bg-secondary';
                                        if($tier == 'Silver') $badgeClass = 'bg-info';
                                        if($tier == 'Gold') $badgeClass = 'bg-warning text-dark';
                                        if($tier == 'Platinum') $badgeClass = 'bg-primary';
                                    @endphp
                                    <span class="badge {{ $badgeClass }}">{{ $tier }}</span>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="5" class="text-center py-4 text-muted">No customers found.</td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $customers->links() }}
            </div>
        </div>
    </div>

    <!-- Adjust Points Modal -->
    <div class="modal fade" id="adjustPointsModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Adjust Loyalty Points</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ url('admin/loyalty/adjust') }}" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Select Customer <span class="text-danger">*</span></label>
                            <select name="user_id" class="form-select" required>
                                <option value="">-- Choose Customer --</option>
                                @foreach($customers as $customer)
                                    <option value="{{ $customer->id }}">{{ $customer->name }} ({{ $customer->email }})</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Action <span class="text-danger">*</span></label>
                            <select name="action" class="form-select" required>
                                <option value="add">Add Points</option>
                                <option value="deduct">Deduct Points</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Points Amount <span class="text-danger">*</span></label>
                            <input type="number" name="points" class="form-control" required min="1">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Points</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
