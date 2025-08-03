@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.search') }}
@endsection
@section('content')
    <div class="breadcrumb-sec">
        <div class="container">
            <div class="breadcrumb-sec-content">
                <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li
                            class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }}">
                            <a class="text-dark fw-600" href="{{ URL::to('/') }}">{{ trans('labels.home') }}</a>
                        </li>
                        <li
                            class="breadcrumb-item {{ session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : '' }}">
                            <a class="text-muted" href="javascript:void(0)">{{ trans('labels.search') }}</a>
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <section>
        <div class="container mt-5">
            <div class="menu-section menu-section-header">
                <form action="{{ URL::to('/search') }}" method="get">
                    <div class="form-group">
                        <div class="input-group input-group-lg gap-sm-3 gap-2">
                            <input type="text" class="form-control rounded" name="itemname"
                                placeholder="{{ trans('labels.search_here') }}" required
                                @isset($_GET['itemname']) value="{{ $_GET['itemname'] }}" @endisset>
                            <button class="input-group-text rounded fs-6 bg-primary text-white mb-0" type="submit"
                                id="inputGroup-sizing-lg">{{ trans('labels.search') }}
                                <i class="fa-solid fa-magnifying-glass px-2"></i></button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="container">
            <div class="row my-5">
                <div class="mb-4">
                    <div class="d-flex bg-primary-rgb p-3 rounded-3 justify-content-between align-items-center">
                        <span class="fs-15 fw-600">
                            {{ trans('labels.showing') }}
                            {{ $getsearchitems->firstItem() ? $getsearchitems->firstItem() : 0 }}–{{ $getsearchitems->lastItem() ? $getsearchitems->lastItem() : 0 }}
                            {{ trans('labels.of') }}
                            {{ $getsearchitems->total() }} {{ trans('labels.result') }}
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
                <div class="menu m-0">
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
                        {{-- <div class="row boxes g-4">
                            @foreach ($getsearchitems as $itemdata)
                                @include('web.home1.itemview')
                            @endforeach
                        </div> --}}
                        <div class="mt-5 d-flex justify-content-center">
                            {{ $getsearchitems->appends(request()->query())->links() }}
                        </div>
                    @else
                        @include('web.nodata')
                    @endif
                </div>
            </div>
        </div>
    </section>
@endsection
