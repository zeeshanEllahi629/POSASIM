@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-code-branch me-2"></i>Branches</h5>
                    <a href="{{ url('admin/branch/add') }}" class="btn btn-sm btn-primary"><i class="fa fa-plus me-1"></i> Add Branch</a>
                </div>

                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Name</th>
                                <th>Manager</th>
                                <th>Contact</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th class="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            @forelse($branches as $branch)
                            <tr>
                                <td><strong>{{ $branch->name }}</strong></td>
                                <td>{{ @$branch->manager->name ?? 'No Manager Assigned' }}</td>
                                <td>
                                    @if($branch->phone)<div class="small"><i class="fa fa-phone text-muted me-1"></i> {{ $branch->phone }}</div>@endif
                                    @if($branch->email)<div class="small"><i class="fa fa-envelope text-muted me-1"></i> {{ $branch->email }}</div>@endif
                                </td>
                                <td><small class="text-muted">{{ Str::limit($branch->address, 30) }}</small></td>
                                <td>
                                    @if($branch->status == 1)
                                        <span class="badge bg-success" onclick="changeStatus({{ $branch->id }}, 0)" style="cursor:pointer">Active</span>
                                    @else
                                        <span class="badge bg-danger" onclick="changeStatus({{ $branch->id }}, 1)" style="cursor:pointer">Inactive</span>
                                    @endif
                                </td>
                                <td class="text-end">
                                    <a href="{{ url('admin/branch/edit/'.$branch->id) }}" class="btn btn-sm btn-outline-info"><i class="fa fa-pen"></i></a>
                                    <a href="#" onclick="deleteData({{ $branch->id }}, '{{ url('admin/branch/delete') }}')" class="btn btn-sm btn-outline-danger"><i class="fa fa-trash"></i></a>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="6" class="text-center py-4 text-muted">No branches found. <a href="{{ url('admin/branch/add') }}">Add your first branch!</a></td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                {{ $branches->links() }}
            </div>
        </div>
    </div>
@endsection
@section('script')
<script>
    function changeStatus(id, status) {
        $.ajax({
            url: "{{ url('admin/branch/status') }}",
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
        if (confirm("Are you sure you want to delete this branch?")) {
            window.location.href = url + '?id=' + id;
        }
    }
</script>
@endsection
