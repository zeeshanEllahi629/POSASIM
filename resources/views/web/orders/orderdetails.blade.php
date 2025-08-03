@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.order_details') }}
@endsection
@section('content')
    <div class="breadcrumb-sec">
        <div class="container">
            <div class="breadcrumb-sec-content">
                <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li
                            class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }}">
                            <a class="text-dark fw-600" href="{{ route('home') }}">{{ trans('labels.home') }}</a>
                        </li>
                        <li class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }} active"
                            aria-current="page">{{ trans('labels.order_details') }}</li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <section>
        <div class="menu-background">
        <div class="container my-5">
            <div class="row">
                @if (Auth::user() && Auth::user()->type == 2)
                    <div class="col-lg-3">
                        @include('web.layout.usersidebar')
                    </div>
                @endif
                <div class="{{ Auth::user() && Auth::user()->type == 2 ? 'col-lg-9' : 'col-lg-12' }} ">
                    <div class="user-content-wrapper">
                        <div
                            class="d-flex flex-wrap gap-2 mb-3 border-bottom pb-3 align-items-center justify-content-between">
                            <p class="title mb-0">{{ trans('labels.order_details') }}</p>
                            <div class="row g-2">
                                @if (@helper::checkaddons('whatsapp_message'))
                                    @if (whatsapp_helper::whatsapp_message_config()->order_created == 1)
                                        @if (whatsapp_helper::whatsapp_message_config()->message_type == 2)
                                            <div class="col-auto">
                                                <a href="https://api.whatsapp.com/send?phone={{ whatsapp_helper::whatsapp_message_config()->whatsapp_number }}&text={{ @$whmessage }}"
                                                    class="btn btn-success d-flex align-items-center gap-1 btn-sm px-4 py-2"
                                                    target="_blank">
                                                    <i class="fab fa-whatsapp"></i>{{ trans('labels.whatsapp_order') }}
                                                </a>
                                            </div>
                                        @endif
                                    @endif
                                @endif
                                @if (@helper::checkaddons('telegram_message'))
                                    @if (@helper::telegramdata()->order_created == 1)
                                        <div class="col-auto">
                                            <a href="{{ URL::to('telegram/' . $orderdata->order_number) }}"
                                                class="btn btn-info text-white d-flex align-items-center gap-1 btn-sm px-4 py-2">
                                                <i class="fab fa-telegram"></i>{{ trans('labels.telegram_order') }}
                                            </a>
                                        </div>
                                    @endif
                                @endif
                                @if ($orderdata->status_type == 1)
                                    <div class="col-auto">
                                        <a class="btn btn-danger btn-sm px-4 py-2 " href="javascript:void(0)"
                                            onclick="cancelorder('{{ $orderdata->order_number }}','{{ URL::to('/orders/cancel') }}')">
                                            <i
                                                class="fa-regular fa-trash {{ session()->get('direction') == '2' ? 'ms-1' : 'me-1' }}"></i>{{ trans('labels.cancel_order') }}
                                        </a>
                                    </div>
                                @endif
                            </div>
                        </div>
                        <div class="row mb-5 g-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-transparent">
                                        <h5 class="fw-bold fs-6 mb-0 py-1">{{ trans('labels.order_info') }}</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.order_number') }} : </p>
                                            &nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->order_number }}</p>
                                        </div>
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.order_type') }} : </p>&nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">
                                                {{ $orderdata->order_type == '1' ? trans('labels.delivery') : trans('labels.pickup') }}
                                            </p>
                                        </div>
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.order_date') }} : </p>&nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">
                                                {{ helper::date_format($orderdata->created_at) }}
                                            </p>
                                        </div>
                                        @if ($orderdata->delivery_date != '' && $orderdata->delivery_date != null)
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">
                                                    {{ $orderdata->order_type == '1' ? trans('labels.delivery_date') : trans('labels.pickup_date') }}
                                                    : </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">
                                                    {{ helper::date_format($orderdata->delivery_date) }}</p>
                                            </div>
                                        @endif
                                        @if ($orderdata->delivery_time != '' && $orderdata->delivery_time != null)
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">
                                                    {{ $orderdata->order_type == '1' ? trans('labels.delivery_time') : trans('labels.pickup_time') }}
                                                    : </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->delivery_time }}</p>
                                            </div>
                                        @endif
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.order_status') }} : </p>
                                            &nbsp;
                                            @if ($orderdata->status_type == '1')
                                                <p class="text-order-placed mb-1 fw-500 fs-7">
                                                    {{ @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name == null ? '-' : @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name }}
                                                </p>
                                            @elseif($orderdata->status_type == '2')
                                                <p class="text-order-waitingpickup mb-1 fw-500 fs-7">
                                                    {{ @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name == null ? '-' : @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name }}
                                                </p>
                                            @elseif($orderdata->status_type == '3')
                                                <p class="text-order-completed mb-1 fw-500 fs-7">
                                                    {{ @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name == null ? '-' : @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name }}
                                                </p>
                                            @elseif($orderdata->status_type == '4')
                                                <p class="text-order-cancelled mb-1 fw-500 fs-7">
                                                    {{ @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name == null ? '-' : @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name }}
                                                </p>
                                            @endif
                                        </div>
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.payment_type') }} : </p>
                                            &nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">
                                                {{ helper::getpayment($orderdata->transaction_type) }}
                                                @if ($orderdata->transaction_type == 16)
                                                    <a href="{{ helper::image_path($orderdata->screenshot) }}"
                                                        target="_blank"
                                                        class="text-danger">{{ trans('labels.click_here') }}</a>
                                                @endif
                                                @if (!in_array($orderdata->transaction_type, [1, 2, 16]))
                                                    [{{ $orderdata->transaction_id }}]
                                                @endif
                                            </p>
                                        </div>
                                        @if (@helper::checkaddons('vendor_tip'))
                                            @if (@helper::otherappdata()->tips_settings == 1)
                                                <div class="d-flex">
                                                    <p class="fw-semibold fs-7 mb-2">{{ trans('labels.tips_pro') }} :
                                                        &nbsp;</p>
                                                    <p class="fw-400 fs-7 text-muted mb-2">
                                                        {{ helper::currency_format($orderdata->tips) }}
                                                    </p>
                                                </div>
                                            @endif
                                        @endif
                                        @if ($orderdata->order_notes != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2 col-auto">{{ trans('labels.order_note') }}
                                                    :
                                                </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">
                                                    {{ $orderdata->order_notes }}
                                                </p>
                                            </div>
                                        @endif
                                        @if ($orderdata->admin_notes != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2 col-auto">{{ trans('labels.admin_note') }}
                                                    :
                                                </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">
                                                    {{ $orderdata->admin_notes }}
                                                </p>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-transparent">
                                        <h5 class="fw-bold fs-6 mb-0 py-1">{{ trans('labels.address_info') }}</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.name') }} : </p>&nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->name }}</p>
                                        </div>
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.email') }} : </p>&nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->email }}</p>
                                        </div>
                                        <div class="d-flex">
                                            <p class="fw-semibold fs-7 mb-2">{{ trans('labels.mobile') }} : </p>&nbsp;
                                            <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->mobile }}</p>
                                        </div>
                                        @if ($orderdata->address != null && $orderdata->address != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">{{ trans('labels.address') }} : </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->address }}</p>
                                            </div>
                                        @endif
                                        @if ($orderdata->city != null && $orderdata->city != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">{{ trans('labels.city') }} : </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->city }}</p>
                                            </div>
                                        @endif
                                        @if ($orderdata->state != null && $orderdata->state != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">{{ trans('labels.state') }} : </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->state }}</p>
                                            </div>
                                        @endif
                                        @if ($orderdata->country != null && $orderdata->country != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">{{ trans('labels.country') }} : </p>&nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->country }}</p>
                                            </div>
                                        @endif
                                        @if ($orderdata->landmark != null && $orderdata->landmark != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">{{ trans('labels.landmark') }} : </p>
                                                &nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->landmark }}</p>
                                            </div>
                                        @endif
                                        @if ($orderdata->postal_code != null && $orderdata->postal_code != '')
                                            <div class="d-flex">
                                                <p class="fw-semibold fs-7 mb-2">{{ trans('labels.pincode') }} : </p>
                                                &nbsp;
                                                <p class="fw-400 fs-7 text-muted mb-2">{{ $orderdata->postal_code }}</p>
                                            </div>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive border-top">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>{{ trans('labels.image') }}</th>
                                        <th>{{ trans('labels.item') }}</th>
                                        <th class="{{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }}">
                                            {{ trans('labels.unit_cost') }}</th>
                                        <th class="{{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }}">
                                            {{ trans('labels.qty') }}</th>
                                        <th class="{{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }}">
                                            {{ trans('labels.subtotal') }}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @php
                                        $data = [];
                                    @endphp
                                    @foreach ($ordersdetails as $orders)
                                        @php
                                            $total_price =
                                                ($orders['item_price'] +
                                                    $orders['addons_total_price'] +
                                                    $orders['extras_total_price']) *
                                                $orders['qty'];
                                            $data[] = ['total_price' => $total_price];
                                            $addonstotal = $orders->addons_total_price + $orders['extras_total_price'];
                                        @endphp

                                        <tr class="align-middle">
                                            <td><img src="{{ helper::image_path($orders->item_image) }}"
                                                    class="rounded hw-50" alt=""></td>
                                            <td>
                                                <img @if ($orders['item_type'] == 1) src="{{ helper::image_path('veg.svg') }}" @else src="{{ helper::image_path('nonveg.svg') }}" @endif
                                                    class="item-type-img" alt="">
                                                <span class="fs-7">{{ $orders->item_name }}</span>
                                                <p class="mb-0 mt-1">
                                                    @if ($orders['addons_id'] != '' || $orders['extras_id'] != '')
                                                        <small>
                                                            <a class="text-muted fw-5400" href="javascript:void(0)"
                                                                onclick="showaddons('{{ $orders['addons_name'] }}','{{ $orders['addons_price'] }}','{{ $orders['extras_name'] }}','{{ $orders['extras_price'] }}','{{ $orders['item_name'] }}')">{{ trans('labels.customize') }}
                                                            </a>
                                                        </small>
                                                    @endif
                                                </p>
                                            </td>
                                            <td
                                                class="{{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }} fs-7">
                                                {{ helper::currency_format($orders->item_price) }}
                                                @if ($addonstotal != '0')
                                                    <br><small class="text-muted">+
                                                        {{ helper::currency_format($addonstotal) }}</small>
                                                @endif
                                            </td>
                                            <td
                                                class="{{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }} fs-7">
                                                {{ $orders->qty }}</td>
                                            <td
                                                class="{{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }} fs-7">
                                                {{ helper::currency_format($total_price) }}</td>
                                        </tr>
                                    @endforeach
                                    @php
                                        $order_total = array_sum(array_column(@$data, 'total_price'));
                                    @endphp
                                </tbody>
                            </table>
                        </div>
                        <div class="d-flex justify-content-end pb-3">
                            <div class="col-md-4 col-12">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item px-0 d-flex justify-content-between">
                                        <span class=""> {{ trans('labels.order_total') }} </span>
                                        <span class="text-break fw-400">{{ helper::currency_format($order_total) }}</span>
                                    </li>
                                    @if ($orderdata->offer_code != null && $orderdata->discount_amount != null)
                                        <li class="list-group-item px-0 d-flex justify-content-between">
                                            <span class=""> {{ trans('labels.discount') }}
                                                {{ $orderdata->offer_code != '' ? '(' . $orderdata->offer_code . ')' : '' }}
                                            </span>
                                            <span class="text-break fw-400">-
                                                {{ helper::currency_format($orderdata->discount_amount) }}</span>
                                        </li>
                                    @endif
                                    @php
                                        $tax = explode('|', $orderdata->tax_amount);
                                        $tax_name = explode('|', $orderdata->tax_name);
                                    @endphp
                                    @if ($orderdata->tax_name != null && $orderdata->tax_amount > 0)
                                        @foreach ($tax as $key => $tax_value)
                                            <li class="list-group-item px-0 d-flex justify-content-between">
                                                <span class=""> {{ $tax_name[$key] }}</span>
                                                <span
                                                    class="text-break fw-400">{{ helper::currency_format($tax[$key]) }}</span>
                                            </li>
                                        @endforeach
                                    @endif
                                    @if ($orderdata->order_type == 1)
                                        <li class="list-group-item px-0 d-flex justify-content-between">
                                            <span class=""> {{ trans('labels.delivery') }}
                                                @if ($orderdata->shipping_area != '')
                                                    ({{ $orderdata->shipping_area }})
                                                @endif
                                            </span>
                                            <span class="text-break fw-400">
                                                @if ($orderdata->delivery_charge > 0)
                                                    {{ helper::currency_format($orderdata->delivery_charge) }}
                                                @else
                                                    {{ trans('labels.free') }}
                                                @endif
                                            </span>
                                        </li>
                                    @endif
                                    <li class="list-group-item px-0 d-flex justify-content-between">
                                        <span class="fw-600 text-black"> {{ trans('labels.grand_total') }} </span>
                                        <span
                                            class="fw-600 text-black text-break">{{ helper::currency_format($orderdata->grand_total) }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
    @include('web.subscribeform')
@endsection

<script type="text/javascript">
    toastr.options = {
        "closeButton": true,
        "progressBar": true
    }
    @if (Session::has('success'))
        toastr.success("{{ session('success') }}");
    @endif
    @if (Session::has('error'))
        toastr.error("{{ session('error') }}");
    @endif
</script>
@section('scripts')
    <script src="{{ url(env('ASSETSPATHURL') . 'web-assets/js/custom/orders.js') }}"></script>
@endsection
