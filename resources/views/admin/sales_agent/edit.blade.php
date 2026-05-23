@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <h5 class="card-title border-bottom pb-3 mb-3">Edit Sales Agent</h5>
                <form action="{{ url('admin/sales-agents/update/'.$agent->id) }}" method="POST">
                    @csrf
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Agent Name</label>
                            <input type="text" class="form-control bg-light" value="{{ @$agent->user_info->name }}" readonly>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Branch Assignment</label>
                            <select name="branch_id" class="form-select">
                                <option value="">All Branches</option>
                                @foreach($branches as $branch)
                                    <option value="{{ $branch->id }}" {{ $agent->branch_id == $branch->id ? 'selected' : '' }}>{{ $branch->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Monthly Target Amount <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <span class="input-group-text">$</span>
                                <input type="number" name="target_amount" class="form-control" required min="0" step="0.01" value="{{ $agent->target_amount }}">
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Commission Rate (%) <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="number" name="commission_rate" class="form-control" required min="0" max="100" step="0.01" value="{{ $agent->commission_rate }}">
                                <span class="input-group-text">%</span>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Status <span class="text-danger">*</span></label>
                            <select name="status" class="form-select" required>
                                <option value="1" {{ $agent->status == 1 ? 'selected' : '' }}>Active</option>
                                <option value="0" {{ $agent->status == 0 ? 'selected' : '' }}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="text-end">
                        <a href="{{ url('admin/sales-agents') }}" class="btn btn-outline-secondary me-2">Cancel</a>
                        <button type="submit" class="btn btn-primary">Update Agent</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
