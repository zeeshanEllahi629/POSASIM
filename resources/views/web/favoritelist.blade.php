@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.favourite_list') }}
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
                            aria-current="page">{{ trans('labels.favourite_list') }}</li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <section>
        <div class="menu-background">
        <div class="container my-5 favourite">
            <div class="row">
                <div class="col-lg-3">
                    @include('web.layout.usersidebar')
                </div>
                <div class="col-lg-9 d-flex">
                    <div class="user-content-wrapper">
                        <p class="title border-bottom pb-3 mb-1">{{ trans('labels.favourite_list') }}</p>
                        @if (count($getfavoritelist) > 0)
                            @if (helper::appdata()->product_card_view == 1)
                                <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col menu">
                                            @include('web.product_card.grid_view.gridview_1')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 2)
                                <div
                                    class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col theme-2-menu">
                                            @include('web.product_card.grid_view.gridview_2')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 3)
                                <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col theme-3">
                                            @include('web.product_card.grid_view.gridview_3')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 4)
                                <div
                                    class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col theme-4">
                                            @include('web.product_card.grid_view.gridview_4')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 5)
                                <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col">
                                            @include('web.product_card.grid_view.gridview_5')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 6)
                                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col">
                                            @include('web.product_card.grid_view.gridview_6')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 7)
                                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col">
                                            @include('web.product_card.grid_view.gridview_7')
                                        </div>
                                    @endforeach
                                </div>
                            @elseif (helper::appdata()->product_card_view == 8)
                                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    @foreach ($getfavoritelist as $itemdata)
                                        <div class="col">
                                            @include('web.product_card.grid_view.gridview_8')
                                        </div>
                                    @endforeach
                                </div>
                            @endif
                            <div class="mt-3 d-flex justify-content-center">
                                {{ $getfavoritelist->links() }}
                            </div>
                        @else
                            <div class="my-5 py-5">
                                @include('web.nodata')
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
    @include('web.subscribeform')
@endsection
