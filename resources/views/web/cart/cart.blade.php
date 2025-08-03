@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.my_cart') }}
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
                            aria-current="page">{{ trans('labels.cart') }}</li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <div class="menu-background">
        <section>
        <div class="container">
            <div class="cart-view my-5">
                @if (count($getcartlist) > 0)
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                            @if (@helper::checkaddons('cart_checkout_countdown'))
                                @include('web.cart_checkout_countdown')
                            @endif
                            <div class="card px-0 overflow-hidden border-bottom-0 rounded-3">
                                <div class="table-responsive">
                                    <table class="table m-0">
                                        <thead class="table-light bg-primary">
                                            <tr>
                                                <th class="cart-table-title p-3 text-white">
                                                    {{ trans('labels.item') }}
                                                </th>
                                                <th class="cart-table-title p-3 text-white">
                                                    {{ trans('labels.price') }}
                                                </th>
                                                <th class="cart-table-title p-3 text-white">
                                                    {{ trans('labels.qty') }}</th>
                                                <th class="cart-table-title p-3 text-white">
                                                    {{ trans('labels.total') }}</th>
                                                <th class="cart-table-title p-3 text-white text-center">
                                                    {{ trans('labels.action') }}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            @php
                                                $order_total = 0;
                                                $total_item_qty = 0;
                                            @endphp
                                            @foreach ($getcartlist as $cartitems)
                                                <tr>
                                                    <td>
                                                        <div class="tbl_cart_product gap-3">
                                                            <div
                                                                class="col-auto d-none d-md-flex  justify-content-center item-img-none">
                                                                <div class="item-img">
                                                                    <img src="{{ helper::image_path($cartitems->item_image) }}"
                                                                        alt="item-image">
                                                                </div>
                                                            </div>
                                                            <div class="tbl_cart_product_caption">
                                                                <div class="d-flex gap-1 align-items-center mb-1">
                                                                    <img @if ($cartitems->item_type == 1) src="{{ helper::image_path('veg.svg') }}" @else src="{{ helper::image_path('nonveg.svg') }}" @endif
                                                                        class="item-type-image" alt="">
                                                                    <h5 class="tbl_pr_title line-2 m-0 fs-6">
                                                                        {{ $cartitems->item_name }}
                                                                    </h5>
                                                                </div>
                                                                @if ($cartitems->addons_id != '' || $cartitems->extras_id != '')
                                                                    <small>
                                                                        <a class="text-muted fw-400 fs-7"
                                                                            href="javascript:void(0)"
                                                                            onclick="showaddons('{{ $cartitems['addons_name'] }}','{{ $cartitems['addons_price'] }}','{{ $cartitems['extras_name'] }}','{{ $cartitems['extras_price'] }}','{{ $cartitems['item_name'] }}')">{{ trans('labels.customize') }}
                                                                        </a>
                                                                    </small>
                                                                    <br>
                                                                @endif
                                                            </div>
                                                        </div>
                                                    </td>
                                                    @php
                                                        $total_price =
                                                            ($cartitems->item_price +
                                                                $cartitems->addons_total_price +
                                                                $cartitems->extras_total_price) *
                                                            $cartitems->qty;
                                                        $order_total += (float) $total_price;
                                                        $total_item_qty += $cartitems->qty;
                                                    @endphp
                                                    <td>
                                                        <h4 class="tbl_org_price">
                                                            {{ helper::currency_format($cartitems->item_price + $cartitems->addons_total_price + $cartitems->extras_total_price) }}
                                                        </h4>
                                                    </td>
                                                    <td>
                                                        <nav aria-label="Page navigation example">
                                                            <ul
                                                                class="qtladd mb-0 {{ session()->get('direction') == '2' ? 'rtl' : '' }}">
                                                                <li>
                                                                    <button class="qty_button"
                                                                        onclick="qtyupdate('{{ $cartitems['id'] }}','minus','{{ URL::to('/cart/qtyupdate') }}')">
                                                                        <span aria-hidden="true">
                                                                            <i class="fa-light fa-minus fs-10"></i>
                                                                        </span>
                                                                    </button>
                                                                </li>
                                                                <li class="qtl-count">
                                                                    <input type="text" class="border py-1 w-100"
                                                                        id="number_{{ $cartitems->id }}" name="number"
                                                                        value="{{ $cartitems->qty }}" readonly="">
                                                                </li>
                                                                <li>
                                                                    <button class="qty_button"
                                                                        onclick="qtyupdate('{{ $cartitems['id'] }}','plus','{{ URL::to('/cart/qtyupdate') }}')">
                                                                        <span aria-hidden="true">
                                                                            <i class="fa-light fa-plus fs-10"></i>
                                                                        </span>
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </nav>
                                                    </td>
                                                    <td>
                                                        <h4 class="tbl_org_price">
                                                            {{ helper::currency_format($total_price) }}
                                                        </h4>
                                                    </td>
                                                    <td>
                                                        <div class="tbl_pr_action">
                                                            <a class="tbl_remove"
                                                                onclick="deletecartitem('{{ $cartitems['id'] }}','{{ URL::to('/cart/deleteitem') }} ')  ">
                                                                <i class="fa-light fa-trash-can fs-7"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            @endforeach
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p class="text-white text-end fs-7 line-2 mt-2">{{ trans('labels.cart_text_message') }}</p>
                            @if (@helper::checkaddons('cart_checkout_progressbar'))
                                @include('web.cart_checkout_progressbar')
                            @endif
                            <div class="row g-3 justify-content-between mt-0 align-items-center">
                                <div
                                    class="col-xl-3 col-lg-4 col-sm-6 col-12 {{ session()->get('direction') == '2' ? 'text-end' : '' }}">
                                    <a href="{{ URL::to('/menus') }}" class="btn btn-primary w-100">
                                        <i
                                            class="fa-solid {{ session()->get('direction') == '2' ? 'fa-circle-arrow-right ms-2' : 'fa-circle-arrow-left me-2' }}"></i>
                                        {{ trans('labels.continue_shopping') }}</a>
                                </div>
                                <div
                                    class="col-xl-3 col-lg-4 col-sm-6 col-12 {{ session()->get('direction') == '2' ? 'text-start' : 'text-end' }}">
                                    <button
                                        class="btn btn-primary w-100 d-flex gap-3 justify-content-center align-items-center cart_checkout"
                                        onclick="isopenclose('{{ URL::to('/isopenclose') }}','{{ $total_item_qty }}','{{ $order_total }}')">
                                        {{ trans('labels.checkout') }}
                                        <div class="loader d-none cart_checkout_loader"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                @else
                    @include('web.nodata')
                @endif
            </div>
        </div>
    </section>
    </div>
    <input type="hidden" name="request_url" id="request_url" value="{{ request()->segments()[0] }}">

    @include('web.subscribeform')
@endsection
@section('scripts')
    <script src="{{ url(env('ASSETSPATHURL') . 'web-assets/js/custom/cart.js') }}"></script>
@endsection
