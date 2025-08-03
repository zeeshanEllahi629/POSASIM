@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.view_all') }}
@endsection
@section('content')
    @if (isset($_GET['type']) && $_GET['type'] != '')
        <div class="breadcrumb-sec">
            <div class="container">
                <div class="breadcrumb-sec-content">
                    @php
                        $type = $_GET['type'];
                        if ($_GET['type'] == 'topitems') {
                            $title = trans('labels.trending');
                        } elseif ($_GET['type'] == 'todayspecial') {
                            $title = trans('labels.todays_special');
                        } elseif ($_GET['type'] == 'recommended') {
                            $title = trans('labels.recommended');
                        } elseif ($_GET['type'] == 'topdeals') {
                            $title = trans('labels.top_deals');
                        } else {
                            $title = '';
                        }
                    @endphp
                    <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li
                                class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }}">
                                <a class="text-dark fw-600" href="{{ URL::to('/') }}">{{ trans('labels.home') }}</a>
                            </li>
                            <li class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }} active"
                                aria-current="page"> {{ $title }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <div class="container mt-5 mb-4">
            <div class="menu-section">
                <div class="d-flex align-items-center justify-content-between">
                    <h3 class="mb-0 text-capitalize mx-2">{{ trans('labels.product_filter') }}</h3>
                </div>
            </div>
        </div>
    @endif
    <div class="container">
        @if ($_GET['type'] == 'topdeals')
            <div class="countdown" id="topdeals">
                <div class="countdown-counter rounded-3 mb-4 p-3" id="countdown"></div>
            </div>
        @endif
        <div class="my-4">
            <div class="d-flex bg-primary-rgb p-3 rounded-3 justify-content-between align-items-center">
                <span class="fs-15 fw-600">
                    {{ trans('labels.showing') }}
                    {{ $getsearchitems->firstItem() ? $getsearchitems->firstItem() : 0 }}–{{ $getsearchitems->lastItem() ? $getsearchitems->lastItem() : 0 }}
                    {{ trans('labels.of') }}
                    {{ $getsearchitems->total() }} {{ trans('labels.result') }}
                </span>
                <ul class="d-flex flex-nowrap justify-content-end gap-2 nav nav-pills nav-pills-dark" id="tour-pills-tab"
                    role="tablist">
                    <li class="nav-item dropdown">
                        <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark"
                            data-bs-toggle="dropdown" aria-expanded="false" type="button" tooltip="Product Filter">
                            <i class="fa-solid fa-filter"></i>
                        </a>
                        <ul
                            class="dropdown-menu shadow bg-body-secondary border-0 mt-1 {{ session()->get('direction') == '2' ? 'min-dropdownss-rtl' : 'min-dropdownss-ltr' }}">
                            <li>
                                <a class="dropdown-item d-flex gap-2 align-items-center p-2 @if (isset($_GET['filter']) && $_GET['filter'] == 'veg') active-cat @else @endif"
                                    @if (isset($_GET['filter']) && $_GET['filter'] == 'veg') href="{{ URL::to('/view-all?type=' . @$type) }}" @else href="{{ URL::to('/view-all?type=' . @$type . '&filter=veg') }}" @endif>
                                    <img src="{{ helper::image_path('veg.svg') }}" alt="">
                                    {{ trans('labels.veg') }}
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item d-flex gap-2 align-items-center p-2 @if (isset($_GET['filter']) && $_GET['filter'] == 'nonveg') active-cat @else @endif"
                                    @if (isset($_GET['filter']) && $_GET['filter'] == 'nonveg') href="{{ URL::to('/view-all?type=' . @$type) }}" @else href="{{ URL::to('/view-all?type=' . @$type . '&filter=nonveg') }}" @endif>
                                    <img src="{{ helper::image_path('nonveg.svg') }}" alt="">
                                    {{ trans('labels.nonveg') }}
                                </a>
                            </li>
                            @if (@$_GET['type'] == 'todayspecial' || @$_GET['type'] == 'topdeals')
                                <li>
                                    <a class="dropdown-item d-flex gap-2 align-items-center p-2 @if (isset($_GET['filter']) && $_GET['filter'] == 'price-high-to-low') active-cat @else @endif"
                                        @if (isset($_GET['filter']) && $_GET['filter'] == 'price-high-to-low') href="{{ URL::to('/view-all?type=' . @$type) }}" @else href="{{ URL::to('/view-all?type=' . @$type . '&filter=price-high-to-low') }}" @endif>
                                        <i class="fa-solid fa-money-bill fs-6"></i>
                                        {{ trans('labels.p_high_to_low') }}
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex gap-2 align-items-center p-2 @if (isset($_GET['filter']) && $_GET['filter'] == 'price-low-to-high') active-cat @else @endif"
                                        @if (isset($_GET['filter']) && $_GET['filter'] == 'price-low-to-high') href="{{ URL::to('/view-all?type=' . @$type) }}" @else href="{{ URL::to('/view-all?type=' . @$type . '&filter=price-low-to-high') }}" @endif>
                                        <i class="fa-solid fa-money-bill fs-6"></i>
                                        {{ trans('labels.p_low_to_high') }}
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex gap-2 align-items-center p-2 @if (isset($_GET['filter']) && $_GET['filter'] == 'ratting-high-to-low') active-cat @else @endif"
                                        @if (isset($_GET['filter']) && $_GET['filter'] == 'ratting-high-to-low') href="{{ URL::to('/view-all?type=' . @$type) }}" @else href="{{ URL::to('/view-all?type=' . @$type . '&filter=ratting-high-to-low') }}" @endif>
                                        <i class="fa-solid fa-star fs-6"></i>
                                        {{ trans('labels.r_high_to_low') }}
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item d-flex gap-2 align-items-center p-2 @if (isset($_GET['filter']) && $_GET['filter'] == 'ratting-low-to-high') active-cat @else @endif"
                                        @if (isset($_GET['filter']) && $_GET['filter'] == 'ratting-low-to-high') href="{{ URL::to('/view-all?type=' . @$type) }}" @else href="{{ URL::to('/view-all?type=' . @$type . '&filter=ratting-low-to-high') }}" @endif>
                                        <i class="fa-solid fa-star fs-6"></i>
                                        {{ trans('labels.r_low_to_high') }}
                                    </a>
                                </li>
                            @endif
                        </ul>
                    </li>
                    <!-- Tab item -->
                    <li class="nav-item">
                        <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark service-active"
                            id="column" tooltip="Grid view">
                            <i class="fa-solid fa-grid-2"></i>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark" id="grid"
                            tooltip="List view">
                            <i class="fa-solid fa-list-ul"></i>
                        </a>
                    </li>
                    <!-- Tab item -->
                </ul>
            </div>
        </div>
        <div class="row mb-5">
            <div class="my-0">
                @if (count($getsearchitems) > 0)
                    <div class="listing-view">
                        @if (helper::appdata()->product_card_view == 1)
                            <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col menu">
                                        @include('web.product_card.grid_view.gridview_1')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 2)
                            <div
                                class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col theme-2-menu">
                                        @include('web.product_card.grid_view.gridview_2')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 3)
                            <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col theme-3">
                                        @include('web.product_card.grid_view.gridview_3')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 4)
                            <div
                                class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col theme-4">
                                        @include('web.product_card.grid_view.gridview_4')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 5)
                            <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.grid_view.gridview_5')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 6)
                            <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.grid_view.gridview_6')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 7)
                            <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.grid_view.gridview_7')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 8)
                            <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.grid_view.gridview_8')
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                    <div id="column-view" class="d-none">
                        @if (helper::appdata()->product_card_view == 1)
                            <div
                                class="row row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4 menu-special">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_1')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 2)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-list">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_2')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 3)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-3-card">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_3')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 4)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col theme-4-list">
                                        @include('web.product_card.list_view.listview_4')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 5)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_5')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 6)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_6')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 7)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_7')
                                    </div>
                                @endforeach
                            </div>
                        @elseif (helper::appdata()->product_card_view == 8)
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                @foreach ($getsearchitems as $itemdata)
                                    <div class="col">
                                        @include('web.product_card.list_view.listview_8')
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                    <div class="mt-5 d-flex justify-content-center">
                        {{ $getsearchitems->appends(request()->query())->links() }}
                    </div>
                @else
                    @include('web.nodata')
                @endif
            </div>
        </div>
    </div>

    @include('web.subscribeform')

@endsection
@section('scripts')
    <script>
        var topdeals = "{{ !empty(@$getsearchitems) ? 1 : 0 }}";
    </script>
@endsection
