@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                    <h5 class="card-title mb-0"><i class="fa fa-history me-2"></i>Stock Adjustment History</h5>
                    <a href="{{ url('admin/inventory') }}" class="btn btn-sm btn-outline-primary"><i class="fa fa-arrow-left me-1"></i> Dashboard</a>
                </div>

                @if($logs->count() > 0)
                <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Date</th>
                                <th>User</th>
                                <th>Action</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($logs as $key => $log)
                            <tr>
                                <td>{{ $logs->firstItem() + $key }}</td>
                                <td>
                                    {{ $log->created_at->format('d M Y') }}
                                    <br><small class="text-muted">{{ $log->created_at->format('H:i:s') }}</small>
                                </td>
                                <td>
                                    <i class="fa fa-user-circle text-primary me-1"></i>
                                    {{ @$log->user_info->name ?? 'System' }}
                                </td>
                                <td><span class="badge bg-primary">{{ ucfirst(str_replace('_', ' ', $log->action)) }}</span></td>
                                <td>
                                    <small>{{ $log->description }}</small>
                                    @if($log->ip_address)
                                        <br><small class="text-muted">IP: {{ $log->ip_address }}</small>
                                    @endif
                                </td>
                            </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
                {{ $logs->links() }}
                @else
                    @include('admin.nodata')
                @endif
            </div>
        </div>
    </div>
@endsection
