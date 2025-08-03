<!-- header section start -->
<header>
    @if (env('Environment') == 'sendbox')
        <div class="top-header">
            <div class="container">
                <div class="d-block d-md-flex justify-content-center align-items-center">
                    <p class="text-center mb-0"> <a href="https://1.envato.market/zaoZ4r" target="_blank"
                            class="fs-7 text-dark">This is a demo website - Buy genuine Single Restaurant we using our
                            official link! Click Now >>> Buy Now</a></p>
                </div>
            </div>
        </div>
    @endif
    <div class="header-bar" id="header1">
        <nav class="navbar navbar-expand-lg sticky-top p-0">
            <div class="container navbar-container">
                <div class="d-flex align-items-center gap-2">
                    <div class="d-lg-none">
                        <button class="m-0 bg-transparent border-0 text-white" type="button"
                            data-bs-toggle="offcanvas" data-bs-target="#footersiderbar"
                            aria-controls="footersiderbar">
                            <i class="fa-solid fa-bars fs-3"></i>
                        </button>
                    </div>
                    <a class="navbar-brand" href="{{ route('home') }}">
                        <img class="img-resposive img-fluid" src="{{ helper::image_path(@helper::appdata()->logo) }}"
                            alt="logo">
                    </a>
                    
                </div>
                <!-- language-btn -->
                @if (@helper::checkaddons('language'))
                    <div class="buttons gap-3 d-flex align-items-center">
                        <div class="dropdown d-block d-lg-none">
                            <a type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="{{ helper::image_path(Session::get('flag')) }}"
                                class="img-fluid lag-img rounded-5" alt="">
                            </a>
                            <ul class="dropdown-menu bg-body-secondary mt-1 border-0 shadow p-0 overflow-hidden {{ session()->get('direction') == '2' ? 'min-dropdown-rtl' : 'min-dropdowns-ltr' }}"
                                aria-labelledby="dropdownMenuButton1">
                                @foreach (helper::language() as $lang)
                                    <li>
                                        <a class="dropdown-item text-dark p-2 d-flex gap-2 align-items-center"
                                            href="{{ URL::to('/language-' . $lang->code) }}">
                                            <img src="{{ helper::image_path($lang->image) }}"
                                                class="img-fluid lag-img rounded-5" alt="">{{ $lang->name }}
                                        </a>
                                    </li>
                                @endforeach
                            </ul>
                        </div>
                        
                    </div>
                @endif
                <!-- language-btn -->

                {{-- for large devices - for header bar --}}
                <div class="navbar-collapse collapse">
                    <div class="navbar-nav mx-auto">
                        <a class="nav-link px-3 {{ request()->is('/') ? 'active' : '' }}"
                            href="{{ route('home') }}">{{ trans('labels.home') }}</a>
                        <a class="nav-link px-3 {{ request()->is('menus') ? 'active' : '' }}"
                            href="{{ route('menus') }}">{{ trans('labels.menu') }}</a>
                        @if (@helper::checkaddons('blog'))
                            <a class="nav-link px-3 {{ request()->is('blogs') ? 'active' : '' }}"
                                href="{{ route('blogs') }} ">{{ trans('labels.blogs') }}</a>
                        @endif
                        <a class="nav-link px-3 {{ request()->is('faq') ? 'active' : '' }}"
                            href="{{ route('faq') }}">{{ trans('labels.faq') }}</a>
                        <a class="nav-link px-3 {{ request()->is('contactus') ? 'active' : '' }}"
                            href="{{ route('contact-us') }} ">{{ trans('labels.help_contact_us') }}</a>

                        @if (env('Environment') == 'sendbox')
                            <li class="nav-item dropdown">
                                <a class="nav-link px-3 text-white dropdown-toggle" href="javascript:void(0)"
                                    id="menudropdown" data-bs-toggle="dropdown" aria-expanded="false">Theme</a>
                                <ul class="dropdown-menu theme-menu text-black " aria-labelledby="menudropdown"
                                    id="style-3">
                                    <li>
                                        <a class="nav-link" href="{{ URL::to('/?theme_id=1') }}">Theme-1</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="{{ URL::to('/?theme_id=2') }}">Theme-2 (Addon)</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="{{ URL::to('/?theme_id=3') }}">Theme-3 (Addon)</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="{{ URL::to('/?theme_id=4') }}">Theme-4 (Addon)</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="{{ URL::to('/?theme_id=5') }}">Theme-5 (Addon)</a>
                                    </li>
                                </ul>
                            </li>
                        @endif

                    </div>
                    <div class="d-flex gap-3 align-items-center nav-sidebar-d-none">
                        <!-- language-btn -->
{{--                        @if (@helper::checkaddons('language'))--}}
{{--                            <div class="lag dropdown">--}}
{{--                                <a class="header-box" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"--}}
{{--                                    aria-expanded="false"><img src="{{ helper::image_path(Session::get('flag')) }}"--}}
{{--                                        class="img-fluid lag-img rounded-5" alt=""></a>--}}
{{--                                <ul class="dropdown-menu bg-body-secondary mt-1 border-0 shadow p-0 overflow-hidden {{ session()->get('direction') == '2' ? 'min-dropdown-rtl' : 'min-dropdown-ltr' }}" aria-labelledby="dropdownMenuButton1">--}}
{{--                                    @foreach (helper::language() as $lang)--}}
{{--                                        <li>--}}
{{--                                            <a class="dropdown-item text-dark d-flex gap-2 align-items-center p-2"--}}
{{--                                                href="{{ URL::to('/language-' . $lang->code) }}">--}}
{{--                                                <img src="{{ helper::image_path($lang->image) }}"--}}
{{--                                                    class="img-fluid lag-img rounded-5"--}}
{{--                                                    alt="">{{ $lang->name }}--}}
{{--                                            </a>--}}
{{--                                        </li>--}}
{{--                                    @endforeach--}}
{{--                                </ul>--}}
{{--                            </div>--}}
{{--                        @endif--}}
{{--                        <div class="header-search header-box">--}}
{{--                            <input type="text" class="search-form" placeholder="{{ trans('labels.search_here') }}"--}}
{{--                                required>--}}
{{--                            @if (session()->get('direction') == '')--}}
{{--                                <a href="{{ route('search') }}" class="search-button">--}}
{{--                                    <i class="fa-solid fa-magnifying-glass"></i>--}}
{{--                                </a>--}}
{{--                            @elseif (session()->get('direction') == '2')--}}
{{--                                <a href="{{ route('search') }}" class="search-button">--}}
{{--                                    <i class="fa-solid fa-magnifying-glass"></i>--}}
{{--                                </a>--}}
{{--                            @else--}}
{{--                                <a href="{{ route('search') }}" class="search-button">--}}
{{--                                    <i class="fa-solid fa-magnifying-glass"></i>--}}
{{--                                </a>--}}
{{--                            @endif--}}
{{--                        </div>--}}
                        <!-- cart-btn -->
                        <div class="cart-area header-box">
                            <a href="{{ route('cart') }}" class="text-white">
                                <i class="fa-solid fa-cart-shopping"></i>
                                @if (Auth::user() && Auth::user()->type == 2)
                                    <span class="cart-badge cart-count">{{ helper::get_user_cart() }}</span>
                                @endif
                            </a>
                        </div>

                        <!-- user-btn -->
                        @if (@helper::checkaddons('customer_login'))
                            @if (helper::appdata()->login_required == 1)
                                <div class="header-box ">
                                    @if (Auth::user() && Auth::user()->type == 2)
                                        <a class="nav-link text-white" href="{{ route('user-profile') }}"
                                            role="button">
                                            <i class="fa-solid fa-user"></i>
                                        </a>
                                    @else
                                        <a href="{{ route('login') }}" class="text-white">
                                            <i class="fa-solid fa-user"></i></a>
                                    @endif
                                </div>
                            @endif
                        @endif
                    </div>
                </div>
            </div>
        </nav>
    </div>
</header>
<!-- header section end -->

<!-- offer btn start-->
@if (@helper::checkaddons('coupon'))
    <div class="{{ session()->get('direction') == '2' ? 'rtl-buttons' : 'ltr-buttons' }}">
        @if (!empty(helper::getoffers()) && count(helper::getoffers()) > 0)
            <button class="btn btn-primary offer-button" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasOffer" aria-controls="offcanvasOffer">
                <i class="fa-sharp fa-solid fa-badge-percent"></i> {{ trans('labels.offers') }}
            </button>
        @endif
    </div>
    <div class="offer">
        <div class="offcanvas {{ session()->get('direction') == '2' ? 'offcanvas-start' : 'offcanvas-end' }}"
            tabindex="-1" id="offcanvasOffer" aria-labelledby="offcanvasOfferLabel">
            <div class="offcanvas-header border-bottom bg-light">
                <div class="d-flex d-grid gap-2 align-items-center">
                    <i class="fa-sharp fa-solid fa-badge-percent"></i>
                    <h5 class="offcanvas-title fw-600" id="offcanvasOfferLabel">{{ trans('labels.offers') }}</h5>
                </div>
                <button type="button"
                    class="btn-close {{ session()->get('direction') == '2' ? 'me-auto ms-0' : 'ms-auto me-0' }}"
                    data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="row g-3">
                    @foreach (helper::getoffers() as $offers)
                        @php
                            $count = helper::getcouponcodecount($offers->offer_code);
                        @endphp
                        @if ($offers->usage_type == 1)
                            @if ($count < $offers->usage_limit)
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between">
                                                <span class="coupons-label">{{ $offers->offer_code }}</span>
                                                @if (request()->is('checkout'))
                                                    <p class="fw-500 cursor-pointer copy_coupon_code mb-0"
                                                        data-bs-dismiss="offcanvas"
                                                        onclick="getoffercode('{{ $offers->offer_code }}')">
                                                        {{ trans('labels.copy_code') }}
                                                    </p>
                                                @endif
                                            </div>
                                            <h5 class="pt-3 mb-0 offer-text">{{ $offers->offer_name }}</h5>
                                            <p class="text-muted fw-400 fs-8 pt-2 mb-0">{{ $offers->description }}</p>
                                        </div>
                                    </div>
                                </div>
                            @endif
                        @else
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <span class="coupons-label">{{ $offers->offer_code }}</span>
                                            @if (request()->is('checkout'))
                                                <p class="fw-500 cursor-pointer copy_coupon_code mb-0"
                                                    data-bs-dismiss="offcanvas"
                                                    onclick="getoffercode('{{ $offers->offer_code }}')">
                                                    {{ trans('labels.copy_code') }}
                                                </p>
                                            @endif
                                        </div>
                                        <h5 class="pt-3 mb-0 offer-text">{{ $offers->offer_name }}</h5>
                                        <p class="text-muted fw-400 fs-8 pt-2 mb-0">{{ $offers->description }}</p>
                                    </div>
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
            </div>
        </div>
    </div>
@endif
<!-- offer btn end-->

<div class="mobile_menu_footer d-lg-none">
    <div class="container">
        <ul class="d-flex justify-content-between align-items-center mb-0 gap-3">
            <li class="text-center">
                <a href="{{ route('home') }}" class="{{ request()->is('/') ? 'active1' : '' }}">
                    <i class="fa-light fa-house"></i>
                    <p class="mb-0">{{ trans('labels.home') }}</p>
                </a>
            </li>
{{--            <li class="text-center">--}}
{{--                <a href="{{ route('search') }}" class="{{ request()->is('search') ? 'active1' : '' }}">--}}
{{--                    <i class="fa-light fa-magnifying-glass"></i>--}}
{{--                    <p class="mb-0">{{ trans('labels.search') }}</p>--}}
{{--                </a>--}}
{{--            </li>--}}
            <li class="text-center">
                <a href="{{ route('cart') }}" class="{{ request()->is('cart') ? 'active1' : '' }}">
                    <div class="">
                        <i class="fa-light fa-bag-shopping position-relative">
                            @if (Auth::user() && Auth::user()->type == 2)
                            <span class="qut_counter">{{ helper::get_user_cart() }}</span>
                            @endif
                        </i>
                    </div>
                    <p class="mb-0">{{ trans('labels.cart') }}</p>
                </a>
            </li>
            @if (@helper::checkaddons('customer_login'))
                @if (helper::appdata()->login_required == 1)
                    <li class="text-center">
                        <a href="{{ Auth::user() ? route('user-favouritelist') : route('login') }}"
                            class="{{ request()->is('favouritelist') ? 'active1' : '' }}">
                            <i class="fa-light fa-heart"></i>
                            <p class="mb-0">{{ trans('labels.wishlist') }}</p>
                        </a>
                    </li>
                    <li class="text-center">
                        <a href="{{ Auth::user() ? route('user-profile') : route('login') }}"
                            class="{{ request()->is('profile') ? 'active1' : '' }}">
                            <i class="fa-light fa-user"></i>
                            <p class="mb-0">{{ trans('labels.account') }}</p>
                        </a>
                    </li>
                @endif
            @endif
        </ul>
    </div>
</div>

<div class="offcanvas {{ session()->get('direction') == '2' ? 'offcanvas-end' : 'offcanvas-start' }}" tabindex="-1"
    id="footersiderbar" aria-labelledby="footersiderbar">
    <div class="offcanvas-header justify-content-between border-bottom">
        <img src="{{ helper::image_path(@helper::appdata()->logo) }}" height="50" alt="footer_logo">
        <button type="button" class="btn-close shadow m-0" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <h5 class="text-dark text-capitalize border-bottom pb-3 m-0 fw-600">
            {{ trans('labels.pages') }}
        </h5>
        <ul class="list-group list-add list-group-flush border-bottom">
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('categories') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.menu') }}
                </a>
            </li>
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('faq') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.faq') }}
                </a>
            </li>
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('contact-us') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.help_contact_us') }}
                </a>
            </li>
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('gallery') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.gallery') }}
                </a>
            </li>
            @if (@helper::checkaddons('blog'))
                <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                    <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('blogs') }}">
                        <i class="fa-solid fa-circle-dot fs-7"></i>
                        {{ trans('labels.blogs') }}
                    </a>
                </li>
            @endif
        </ul>
        <h5 class="text-dark text-capitalize border-bottom py-3 m-0 fw-600">
            {{ trans('labels.other') }}
        </h5>
        <ul class="list-group list-add list-group-flush border-bottom">
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('about-us') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.about') }}
                </a>
            </li>
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('privacy-policy') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.privacy_policy') }}
                </a>
            </li>
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('refund-policy') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.refund_policy') }}
                </a>
            </li>
            <li class="list-group-item px-0 py-3 {{ session()->get('direction') == '2' ? 'pe-3' : 'ps-3' }}">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="{{ route('terms-conditions') }}">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    {{ trans('labels.terms_condition') }}
                </a>
            </li>
        </ul>
        <h5 class="text-dark text-capitalize py-3 m-0 fw-600">Get in Touch with Us</h5>
        <ul class="">
            <li class="py-2">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="callto:{{ helper::appdata()->mobile }}">
                    <i class="fa-solid fa-phone fs-7"></i>
                    {{ helper::appdata()->mobile }}
                </a>
            </li>
            <li class="py-2">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="mailto:{{ helper::appdata()->email }}">
                    <i class="fa-solid fa-envelope fs-7"></i>
                    {{ helper::appdata()->email }}
                </a>
            </li>
        </ul>
        @if (helper::sociallinks()->count() > 0)
            <div class="social-media">
                <h5 class="text-dark text-capitalize pt-3 m-0 mt-3 fw-600 border-top">Follow us</h5>
                <div class="d-flex flex-wrap gap-2 mt-3">
                    @foreach (helper::sociallinks() as $sociallink)
                        <div class="footer-box">
                            <a class="text-white" href="{{ $sociallink->link }}" target="_blank">
                                {!! $sociallink->icon !!} </a>
                        </div>
                    @endforeach
                </div>
            </div>
            <!-- Social media icon -->
        @endif
        <hr class="mt-4 text-white mb-0">
    </div>
    <div class="offcanvas-footer border-top">
        <p class="m-0 fs-7 text-center text-light fw-500 px-2 py-2">
            {{ helper::appdata()->copyright }}
        </p>
    </div>
</div>
