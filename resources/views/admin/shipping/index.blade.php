@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <form action="{{ URL::to('admin/shipping/savecontent') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="card border-0 mb-3 p-3 box-shadow">
                        <div class="row">
                            <div class="col-md-6 mb-lg-0">
                                <div class="form-group">
                                    <label class="form-label">{{ trans('labels.min_order_amount_for_free_shipping') }}
                                        <span class="text-danger"> * </span></label>
                                    <input type="text"
                                        class="form-control {{ session()->get('direction') == 2 ? 'input-group-rtl' : '' }}"
                                        name="min_order_amount_for_free_shipping"
                                        placeholder="{{ trans('labels.min_order_amount_for_free_shipping') }}"
                                        value="{{ $content->min_order_amount_for_free_shipping }}" required>
                                </div>
                            </div>
                            @if (@helper::checkaddons('shipping_area'))
                                <div class="col-md-6 mb-lg-0">
                                    <div class="form-group">
                                        <label class="form-label" for="">{{ trans('labels.shipping_area') }}</label>
                                        @if (env('Environment') == 'sendbox')
                                            <span class="badge bg-danger">{{ trans('labels.addon') }}</span>
                                        @endif
                                        <input id="shipping_area-switch" type="checkbox" class="checkbox-switch"
                                            name="shipping_area" value="1"
                                            {{ $content->shipping_area == 1 ? 'checked' : '' }}>
                                        <label for="shipping_area-switch" class="switch">
                                            <span
                                                class="{{ session()->get('direction') == 2 ? 'switch__circle-rtl' : 'switch__circle' }}"><span
                                                    class="switch__circle-inner"></span></span>
                                            <span
                                                class="switch__left {{ session()->get('direction') == 2 ? 'pe-1' : 'ps-1' }}">{{ trans('labels.off') }}</span>
                                            <span
                                                class="switch__right {{ session()->get('direction') == 2 ? 'ps-2' : 'pe-2' }}">{{ trans('labels.on') }}</span>
                                        </label>
                                    </div>
                                </div>
                            @endif
                            <div class="col-md-6 mb-lg-0" id="shipping_charges_section">
                                <div class="form-group">
                                    <label class="form-label">{{ trans('labels.shipping_charges') }}
                                        <span class="text-danger"> *</span></label>
                                    <input type="text"
                                        class="form-control {{ session()->get('direction') == 2 ? 'input-group-rtl' : '' }}"
                                        name="shipping_charges" placeholder="{{ trans('labels.shipping_charges') }}"
                                        value="{{ $content->shipping_charges }}" id="shipping_charges" required>
                                </div>
                            </div>
                            <div class="{{ session()->get('direction') == 2 ? 'text-start' : 'text-end' }}">
                                <button
                                    @if (env('Environment') == 'sendbox') onclick="myFunction()" type="button" @else type="submit" @endif
                                    class="btn btn-primary px-sm-4">{{ trans('labels.save') }}</button>
                            </div>
                        </div>
                    </div>
                </form>

                @if (@helper::checkaddons('shipping_area'))
                    @if (helper::appdata()->shipping_area == 1)
                        <div class="card border-0 mb-3 box-shadow">
                            <div class="d-flex justify-content-between align-items-center mx-3 mt-3">
                                <ol class="breadcrumb m-0">
                                    <li class="breadcrumb-item fs-5 fw-bold">
                                        {{ trans('labels.shipping_area') }}
                                    </li>
                                </ol>
                                <a href="{{ URL::to(request()->url() . '/add') }}" class="btn btn-primary px-sm-4">
                                    <i class="fa-regular fa-plus mx-1"></i>{{ trans('labels.add_new') }}</a>
                            </div>

                            <div class="card-body">
                                <div class="table-responsive">
                                    <table
                                        class="table table-striped table-bordered zero-configuration w-100 dataTable no-footer">
                                        <thead>
                                            <tr class="text-capitalize fw-500 fs-15">
                                                <td></td>
                                                <td>#</td>
                                                <td>{{ trans('labels.area_name') }}</td>
                                                <td>{{ trans('labels.delivery_charge') }}</td>
                                                <td>{{ trans('labels.status') }}</td>
                                                <td>{{ trans('labels.created_date') }}</td>
                                                <td>{{ trans('labels.updated_date') }}</td>
                                                <td>{{ trans('labels.action') }}</td>
                                            </tr>
                                        </thead>

                                        <tbody id="tabledetails" data-url="{{ url('admin/shipping/reorder_shipping') }}">
                                            @foreach ($allshippingcontent as $key => $content)
                                                <tr class="fs-7 row1 align-middle" id="dataid{{ $content->id }}"
                                                    data-id="{{ $content->id }}">
                                                    <td>
                                                        <a tooltip="{{ trans('labels.move') }}">
                                                            <i class="fa-light fa-up-down-left-right mx-2"></i>
                                                        </a>
                                                    </td>
                                                    <td>{{ ++$key }}</td>
                                                    <td>{{ $content->area_name }}</td>
                                                    <td>{{ helper::currency_format($content->delivery_charge) }}
                                                    </td>
                                                    <td>
                                                        @if ($content->is_available == '1')
                                                            <a href="javascript:void(0)"
                                                                tooltip="{{ trans('labels.active') }}"
                                                                @if (env('Environment') == 'sendbox') onclick="myFunction()" @else onclick="StatusUpdate('{{ $content->id }}','2','{{ URL::to('admin/shipping/status') }}')" @endif
                                                                class="btn btn-sm btn-success square">
                                                                <i class="fa-sharp fa-solid fa-check"></i>
                                                            </a>
                                                        @else
                                                            <a href="javascript:void(0)"
                                                                tooltip="{{ trans('labels.deactive') }}"
                                                                @if (env('Environment') == 'sendbox') onclick="myFunction()" @else onclick="StatusUpdate('{{ $content->id }}','1','{{ URL::to('admin/shipping/status') }}')" @endif
                                                                class="btn btn-sm btn-danger square">
                                                                <i class="fa-sharp fa-solid fa-xmark"></i>
                                                            </a>
                                                        @endif
                                                    </td>
                                                    <td>
                                                        {{ helper::date_format($content->created_at) }}<br>
                                                        {{ helper::time_format($content->created_at) }}
                                                    </td>
                                                    <td>
                                                        {{ helper::date_format($content->updated_at) }}<br>
                                                        {{ helper::time_format($content->updated_at) }}
                                                    </td>
                                                    <td>
                                                        <div class="d-flex flex-wrap gap-2">
                                                            <a href="{{ URL::to('/admin/shipping/edit-' . $content->id) }}"
                                                                tooltip="{{ trans('labels.edit') }}"
                                                                class="btn btn-info btn-sm square">
                                                                <i class="fa fa-pen-to-square"></i>
                                                            </a>

                                                            <a href="javascript:void(0)"
                                                                tooltip="{{ trans('labels.delete') }}"
                                                                @if (env('Environment') == 'sendbox') onclick="myFunction()" @else onclick="Delete('{{ $content->id }}','{{ URL::to('admin/shipping/delete') }}')" @endif
                                                                class="btn btn-danger btn-sm square">
                                                                <i class="fa fa-trash"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    @endif
                @endif
            </div>
        </div>
    </div>
@endsection
@section('script')
    <script>
        $("#shipping_area-switch").on("change", function(e) {
            if (this.checked) {
                $("#shipping_charges_section").hide();
                $("#shipping_charges").prop("required", false);
            } else {
                $("#shipping_charges_section").show();
                $("#shipping_charges").prop("required", true);
            }
        }).change();
    </script>
    <script src="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/js/custom/shipping.js') }}"></script>
@endsection
