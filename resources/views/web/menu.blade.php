@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.menu') }} | {{ @$categorydata->category_name }}
@endsection
@section('content')
    @if (!empty($categorydata))
        <div class="breadcrumb-sec mb-3">
            <div class="container">
                <div class="breadcrumb-sec-content">
                    <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li
                                class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }}">
                                <a class="text-dark fw-600" href="{{ URL::to('/') }}">{{ trans('labels.home') }}</a>
                            </li>
                            <li class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }} active"
                                aria-current="page">{{ @$categorydata->category_name }}</li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <section class="menu-section">
            <div class="container">
                <div class="row">
                    <div class="filter-sidebar mb-3">
                        <div class="sidebar-wrap" id="style-3">
                            @if (count($subcategories) > 0 || count($getitemlist) > 0)
                                <a href="{{ URL::to('/menu?category=' . $categorydata->slug) }}"
                                    class="@if (!isset($_GET['subcategory'])) active @endif">{{ trans('labels.all') }}</a>
                            @endif
                            @foreach ($subcategories as $key => $subcatdata)
                                <a href="{{ URL::to('/menu?category=' . $categorydata->slug . '&subcategory=' . $subcatdata->slug) }}"
                                    class="@if (isset($_GET['subcategory']) && $_GET['subcategory'] == $subcatdata->slug) active @endif">{{ ucfirst($subcatdata->subcategory_name) }}</a>
                            @endforeach
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="d-flex bg-primary-rgb p-3 rounded-3 justify-content-between align-items-center">
                            <span class="fs-15 fw-600">
                                {{ trans('labels.showing') }}
                                {{ $getitemlist->firstItem() ? $getitemlist->firstItem() : 0 }}–{{ $getitemlist->lastItem() ? $getitemlist->lastItem() : 0 }}
                                {{ trans('labels.of') }}
                                {{ $getitemlist->total() }} {{ trans('labels.result') }}
                            </span>
                            <ul class="d-flex flex-nowrap justify-content-end gap-2 nav nav-pills nav-pills-dark"
                                id="tour-pills-tab" role="tablist">

                                <!-- Tab item -->
                                <li class="nav-item">
                                    <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark service-active"
                                        id="column" tooltip="Grid view">
                                        <i class="fa-solid fa-grid-2"></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark"
                                        id="grid" tooltip="List view">
                                        <i class="fa-solid fa-list-ul"></i>
                                    </a>
                                </li>
                                <!-- Tab item -->
                            </ul>
                        </div>
                    </div>
                    @if (count($getitemlist) > 0)
                        <div class="menu my-0">
                            <div class="listing-view">
                                @if (helper::appdata()->product_card_view == 1)
                                    <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col menu">
                                                @include('web.product_card.grid_view.gridview_1')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 2)
                                    <div
                                        class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col theme-2-menu">
                                                @include('web.product_card.grid_view.gridview_2')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 3)
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col theme-3">
                                                @include('web.product_card.grid_view.gridview_3')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 4)
                                    <div
                                        class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col theme-4">
                                                @include('web.product_card.grid_view.gridview_4')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 5)
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.grid_view.gridview_5')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 6)
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.grid_view.gridview_6')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 7)
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.grid_view.gridview_7')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 8)
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
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
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_1')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 2)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-list">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_2')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 3)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-3-card">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_3')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 4)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col theme-4-list">
                                                @include('web.product_card.list_view.listview_4')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 5)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_5')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 6)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_6')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 7)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_7')
                                            </div>
                                        @endforeach
                                    </div>
                                @elseif (helper::appdata()->product_card_view == 8)
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        @foreach ($getitemlist as $itemdata)
                                            <div class="col">
                                                @include('web.product_card.list_view.listview_8')
                                            </div>
                                        @endforeach
                                    </div>
                                @endif
                            </div>
                            {{-- <div class="row g-4 boxes">
                                @foreach ($getitemlist as $itemdata)
                                    @include('web.home1.itemview')
                                @endforeach
                            </div> --}}
                        </div>
                        <div class="mt-5 d-flex justify-content-center">
                            {{ $getitemlist->appends(request()->query())->links() }}
                        </div>
                    @else
                        @include('web.nodata')
                    @endif
                </div>
            </div>
        </section>
        @include('web.subscribeform')
    @else
        @include('web.nodata')
    @endif
@endsection
