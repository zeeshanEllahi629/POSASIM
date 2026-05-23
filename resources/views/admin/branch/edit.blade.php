@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="card border-0 box-shadow">
            <div class="card-body">
                <h5 class="card-title border-bottom pb-3 mb-3">Edit Branch</h5>
                <form action="{{ url('admin/branch/update/'.$branch->id) }}" method="POST">
                    @csrf
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Branch Name <span class="text-danger">*</span></label>
                            <input type="text" name="name" class="form-control" required value="{{ $branch->name }}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Branch Manager</label>
                            <select name="manager_id" class="form-select">
                                <option value="">-- Select Manager --</option>
                                @foreach($managers as $manager)
                                    <option value="{{ $manager->id }}" {{ $branch->manager_id == $manager->id ? 'selected' : '' }}>{{ $manager->name }} ({{ $manager->email }})</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Phone Number</label>
                            <input type="text" name="phone" class="form-control" value="{{ $branch->phone }}">
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Email Address</label>
                            <input type="email" name="email" class="form-control" value="{{ $branch->email }}">
                        </div>
                        <div class="col-md-12 mb-3">
                            <label class="form-label">Address</label>
                            <textarea name="address" class="form-control" rows="3">{{ $branch->address }}</textarea>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Status <span class="text-danger">*</span></label>
                            <select name="status" class="form-select" required>
                                <option value="1" {{ $branch->status == 1 ? 'selected' : '' }}>Active</option>
                                <option value="0" {{ $branch->status == 0 ? 'selected' : '' }}>Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div class="text-end">
                        <a href="{{ url('admin/branch') }}" class="btn btn-outline-secondary me-2">Cancel</a>
                        <button type="submit" class="btn btn-primary">Update Branch</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection
