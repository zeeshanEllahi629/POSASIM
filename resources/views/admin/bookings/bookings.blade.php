@extends('admin.theme.default')
@section('content')
    @include('admin.breadcrumb')
    <div class="container-fluid">
        <div class="row">
            <div class="card border-0">
                <div class="card-body">
                    <div class="table-responsive" id="table-display">
                        <table class="table table-striped table-bordered zero-configuration">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>{{ trans('labels.booking_number') }}</th>
                                    <th>{{ trans('labels.user_info') }}</th>
                                    <th>{{ trans('labels.date_time') }}</th>
                                    <th>{{ trans('labels.guests') }}</th>
                                    <th>{{ trans('labels.reservation_type') }}</th>
                                    <th>{{ trans('labels.message') }}</th>
                                    <th>{{ trans('labels.table_number') }}</th>
                                    <th>{{ trans('labels.action') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                                @php $i=1; @endphp
                                @foreach ($getbookings as $booking)
                                    <tr>
                                        <td>@php echo $i++; @endphp</td>
                                        <td>{{ $booking->booking_number }}</td>
                                        <td>{{ $booking->name }} <br> {{ $booking->email }} <br> {{ $booking->mobile }}
                                        </td>
                                        <td>{{ $booking->date }} <br> {{ $booking->time }} </td>
                                        <td>{{ $booking->guests }}</td>
                                        <td>{{ $booking->reservation_type }} </td>
                                        <td>{{ Str::limit($booking->special_request, 100) }}</td>
                                        <td>{{ $booking->status == 2 ? $booking->table_number : '--' }}</td>
                                        <td>
                                            <div class="d-flex flex-wrap gap-1">
                                                @if ($booking->status == 1)
                                                    <a class="btn btn-sm btn-success square open-table-modal"
                                                        data-id="{{ $booking->id }}"
                                                        data-booking-number="{{ $booking->booking_number }}">
                                                        <i class="fa-sharp fa-solid fa-check"></i></a>
                                                    <a class="btn btn-sm btn-danger square"
                                                        @if (env('Environment') == 'sendbox') onclick="myFunction()" @else onclick="StatusUpdate('{{ $booking->id }}','3','{{ URL::to('/admin/bookings/status') }}')" @endif><i
                                                            class="fa-sharp fa-solid fa-xmark"></i></a>
                                                @elseif($booking->status == 2)
                                                    <span class="text-success">{{ trans('labels.accepted') }}</span>
                                                @elseif($booking->status == 3)
                                                    <span class="text-danger">{{ trans('labels.rejected') }}</span>
                                                @else
                                                    --
                                                @endif
                                            </div>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
@section('script')
    <script src="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/js/custom/bookings.js') }}"></script>
@endsection
