@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 box-shadow">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
                            <h5 class="card-title mb-0"><i class="fa fa-plus-circle me-2"></i>Add Supplier</h5>
                            <a href="{{ url('admin/supplier') }}" class="btn btn-sm btn-outline-secondary"><i class="fa fa-arrow-left me-1"></i> Back</a>
                        </div>

                        <form action="{{ url('admin/supplier/store') }}" method="POST">
                            @csrf
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Supplier Name <span class="text-danger">*</span></label>
                                    <input type="text" name="name" class="form-control @error('name') is-invalid @enderror" value="{{ old('name') }}" required>
                                    @error('name') <div class="invalid-feedback">{{ $message }}</div> @enderror
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Company</label>
                                    <input type="text" name="company" class="form-control" value="{{ old('company') }}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Phone</label>
                                    <input type="text" name="phone" class="form-control" value="{{ old('phone') }}">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" name="email" class="form-control" value="{{ old('email') }}">
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Address</label>
                                    <textarea name="address" class="form-control" rows="2">{{ old('address') }}</textarea>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Notes</label>
                                    <textarea name="notes" class="form-control" rows="3" placeholder="Additional notes...">{{ old('notes') }}</textarea>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary"><i class="fa fa-save me-1"></i> Save Supplier</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
