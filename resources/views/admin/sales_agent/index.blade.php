@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-user-tie me-2"></i>Sales Agents</h5>
                    <a href="{{ url('admin/sales-agents/add') }}" class="btn btn-sm btn-primary"><i class="fa fa-plus me-1"></i> Add Sales Agent</a>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Agent Name</th>
                                <th>Branch</th>
                                <th class="text-end">Target Amount</th>
                                <th class="text-center">Commission Rate</th>
                                <th>Status</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($agents as $agent)
                            <tr>
                                <td>
                                    <strong>{{ @$agent->user_info->name }}</strong><br>
                                    <small class="text-muted">{{ @$agent->user_info->email }}</small>
                                </td>
                                <td>{{ @$agent->branch->name ?? 'All Branches' }}</td>
                                <td class="text-end text-success fw-bold">{{ helper::currency_format($agent->target_amount) }}</td>
                                <td class="text-center"><span class="badge bg-info">{{ $agent->commission_rate }}%</span></td>
                                <td>
                                    @if($agent->status == 1)
                                        <span class="badge bg-success" onclick="changeStatus({{ $agent->id }}, 0)" style="cursor:pointer">Active</span>
                                    @else
                                        <span class="badge bg-danger" onclick="changeStatus({{ $agent->id }}, 1)" style="cursor:pointer">Inactive</span>
                                    @endif
                                </td>
                                <td class="text-end">
                                    <a href="{{ url('admin/sales-agents/edit/'.$agent->id) }}" class="btn btn-sm btn-outline-info"><i class="fa fa-pen"></i></a>
                                    <a href="#" onclick="deleteData({{ $agent->id }}, '{{ url('admin/sales-agents/delete') }}')" class="btn btn-sm btn-outline-danger"><i class="fa fa-trash"></i></a>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">No sales agents found. <a href="{{ url('admin/sales-agents/add') }}">Assign your first agent!</a></td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $agents->links() }}
            </div>
        </div>
    </div>
@endsection
@section('script')
<script>
    function changeStatus(id, status) {
        $.ajax({
            url: "{{ url('admin/sales-agents/status') }}",
            type: "GET",
            data: { id: id, status: status },
            success: function(response) {
                if (response.status == 1) {
                    location.reload();
                }
            }
        });
    }
    function deleteData(id, url) {
        if (confirm("Are you sure you want to remove this sales agent?")) {
            window.location.href = url + '?id=' + id;
        }
    }
</script>
@endsection
