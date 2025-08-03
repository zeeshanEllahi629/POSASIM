<!-- header section start -->
<header>
    <?php if(env('Environment') == 'sendbox'): ?>
        <div class="top-header">
            <div class="container">
                <div class="d-block d-md-flex justify-content-center align-items-center">
                    <p class="text-center mb-0"> <a href="https://1.envato.market/zaoZ4r" target="_blank"
                            class="fs-7 text-dark">This is a demo website - Buy genuine Single Restaurant we using our
                            official link! Click Now >>> Buy Now</a></p>
                </div>
            </div>
        </div>
    <?php endif; ?>
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
                    <a class="navbar-brand" href="<?php echo e(route('home')); ?>">
                        <img class="img-resposive img-fluid" src="<?php echo e(helper::image_path(@helper::appdata()->logo)); ?>"
                            alt="logo">
                    </a>
                    
                </div>
                <!-- language-btn -->
                <?php if(@helper::checkaddons('language')): ?>
                    <div class="buttons gap-3 d-flex align-items-center">
                        <div class="dropdown d-block d-lg-none">
                            <a type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="<?php echo e(helper::image_path(Session::get('flag'))); ?>"
                                class="img-fluid lag-img rounded-5" alt="">
                            </a>
                            <ul class="dropdown-menu bg-body-secondary mt-1 border-0 shadow p-0 overflow-hidden <?php echo e(session()->get('direction') == '2' ? 'min-dropdown-rtl' : 'min-dropdowns-ltr'); ?>"
                                aria-labelledby="dropdownMenuButton1">
                                <?php $__currentLoopData = helper::language(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $lang): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <li>
                                        <a class="dropdown-item text-dark p-2 d-flex gap-2 align-items-center"
                                            href="<?php echo e(URL::to('/language-' . $lang->code)); ?>">
                                            <img src="<?php echo e(helper::image_path($lang->image)); ?>"
                                                class="img-fluid lag-img rounded-5" alt=""><?php echo e($lang->name); ?>

                                        </a>
                                    </li>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </ul>
                        </div>
                        
                    </div>
                <?php endif; ?>
                <!-- language-btn -->

                
                <div class="navbar-collapse collapse">
                    <div class="navbar-nav mx-auto">
                        <a class="nav-link px-3 <?php echo e(request()->is('/') ? 'active' : ''); ?>"
                            href="<?php echo e(route('home')); ?>"><?php echo e(trans('labels.home')); ?></a>
                        <a class="nav-link px-3 <?php echo e(request()->is('menus') ? 'active' : ''); ?>"
                            href="<?php echo e(route('menus')); ?>"><?php echo e(trans('labels.menu')); ?></a>
                        <?php if(@helper::checkaddons('blog')): ?>
                            <a class="nav-link px-3 <?php echo e(request()->is('blogs') ? 'active' : ''); ?>"
                                href="<?php echo e(route('blogs')); ?> "><?php echo e(trans('labels.blogs')); ?></a>
                        <?php endif; ?>
                        <a class="nav-link px-3 <?php echo e(request()->is('faq') ? 'active' : ''); ?>"
                            href="<?php echo e(route('faq')); ?>"><?php echo e(trans('labels.faq')); ?></a>
                        <a class="nav-link px-3 <?php echo e(request()->is('contactus') ? 'active' : ''); ?>"
                            href="<?php echo e(route('contact-us')); ?> "><?php echo e(trans('labels.help_contact_us')); ?></a>

                        <?php if(env('Environment') == 'sendbox'): ?>
                            <li class="nav-item dropdown">
                                <a class="nav-link px-3 text-white dropdown-toggle" href="javascript:void(0)"
                                    id="menudropdown" data-bs-toggle="dropdown" aria-expanded="false">Theme</a>
                                <ul class="dropdown-menu theme-menu text-black " aria-labelledby="menudropdown"
                                    id="style-3">
                                    <li>
                                        <a class="nav-link" href="<?php echo e(URL::to('/?theme_id=1')); ?>">Theme-1</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="<?php echo e(URL::to('/?theme_id=2')); ?>">Theme-2 (Addon)</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="<?php echo e(URL::to('/?theme_id=3')); ?>">Theme-3 (Addon)</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="<?php echo e(URL::to('/?theme_id=4')); ?>">Theme-4 (Addon)</a>
                                    </li>
                                    <li>
                                        <a class="nav-link" href="<?php echo e(URL::to('/?theme_id=5')); ?>">Theme-5 (Addon)</a>
                                    </li>
                                </ul>
                            </li>
                        <?php endif; ?>

                    </div>
                    <div class="d-flex gap-3 align-items-center nav-sidebar-d-none">
                        <!-- language-btn -->




































                        <!-- cart-btn -->
                        <div class="cart-area header-box">
                            <a href="<?php echo e(route('cart')); ?>" class="text-white">
                                <i class="fa-solid fa-cart-shopping"></i>
                                <?php if(Auth::user() && Auth::user()->type == 2): ?>
                                    <span class="cart-badge cart-count"><?php echo e(helper::get_user_cart()); ?></span>
                                <?php endif; ?>
                            </a>
                        </div>

                        <!-- user-btn -->
                        <?php if(@helper::checkaddons('customer_login')): ?>
                            <?php if(helper::appdata()->login_required == 1): ?>
                                <div class="header-box ">
                                    <?php if(Auth::user() && Auth::user()->type == 2): ?>
                                        <a class="nav-link text-white" href="<?php echo e(route('user-profile')); ?>"
                                            role="button">
                                            <i class="fa-solid fa-user"></i>
                                        </a>
                                    <?php else: ?>
                                        <a href="<?php echo e(route('login')); ?>" class="text-white">
                                            <i class="fa-solid fa-user"></i></a>
                                    <?php endif; ?>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</header>
<!-- header section end -->

<!-- offer btn start-->
<?php if(@helper::checkaddons('coupon')): ?>
    <div class="<?php echo e(session()->get('direction') == '2' ? 'rtl-buttons' : 'ltr-buttons'); ?>">
        <?php if(!empty(helper::getoffers()) && count(helper::getoffers()) > 0): ?>
            <button class="btn btn-primary offer-button" type="button" data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasOffer" aria-controls="offcanvasOffer">
                <i class="fa-sharp fa-solid fa-badge-percent"></i> <?php echo e(trans('labels.offers')); ?>

            </button>
        <?php endif; ?>
    </div>
    <div class="offer">
        <div class="offcanvas <?php echo e(session()->get('direction') == '2' ? 'offcanvas-start' : 'offcanvas-end'); ?>"
            tabindex="-1" id="offcanvasOffer" aria-labelledby="offcanvasOfferLabel">
            <div class="offcanvas-header border-bottom bg-light">
                <div class="d-flex d-grid gap-2 align-items-center">
                    <i class="fa-sharp fa-solid fa-badge-percent"></i>
                    <h5 class="offcanvas-title fw-600" id="offcanvasOfferLabel"><?php echo e(trans('labels.offers')); ?></h5>
                </div>
                <button type="button"
                    class="btn-close <?php echo e(session()->get('direction') == '2' ? 'me-auto ms-0' : 'ms-auto me-0'); ?>"
                    data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <div class="row g-3">
                    <?php $__currentLoopData = helper::getoffers(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $offers): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <?php
                            $count = helper::getcouponcodecount($offers->offer_code);
                        ?>
                        <?php if($offers->usage_type == 1): ?>
                            <?php if($count < $offers->usage_limit): ?>
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="d-flex justify-content-between">
                                                <span class="coupons-label"><?php echo e($offers->offer_code); ?></span>
                                                <?php if(request()->is('checkout')): ?>
                                                    <p class="fw-500 cursor-pointer copy_coupon_code mb-0"
                                                        data-bs-dismiss="offcanvas"
                                                        onclick="getoffercode('<?php echo e($offers->offer_code); ?>')">
                                                        <?php echo e(trans('labels.copy_code')); ?>

                                                    </p>
                                                <?php endif; ?>
                                            </div>
                                            <h5 class="pt-3 mb-0 offer-text"><?php echo e($offers->offer_name); ?></h5>
                                            <p class="text-muted fw-400 fs-8 pt-2 mb-0"><?php echo e($offers->description); ?></p>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>
                        <?php else: ?>
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <span class="coupons-label"><?php echo e($offers->offer_code); ?></span>
                                            <?php if(request()->is('checkout')): ?>
                                                <p class="fw-500 cursor-pointer copy_coupon_code mb-0"
                                                    data-bs-dismiss="offcanvas"
                                                    onclick="getoffercode('<?php echo e($offers->offer_code); ?>')">
                                                    <?php echo e(trans('labels.copy_code')); ?>

                                                </p>
                                            <?php endif; ?>
                                        </div>
                                        <h5 class="pt-3 mb-0 offer-text"><?php echo e($offers->offer_name); ?></h5>
                                        <p class="text-muted fw-400 fs-8 pt-2 mb-0"><?php echo e($offers->description); ?></p>
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            </div>
        </div>
    </div>
<?php endif; ?>
<!-- offer btn end-->

<div class="mobile_menu_footer d-lg-none">
    <div class="container">
        <ul class="d-flex justify-content-between align-items-center mb-0 gap-3">
            <li class="text-center">
                <a href="<?php echo e(route('home')); ?>" class="<?php echo e(request()->is('/') ? 'active1' : ''); ?>">
                    <i class="fa-light fa-house"></i>
                    <p class="mb-0"><?php echo e(trans('labels.home')); ?></p>
                </a>
            </li>






            <li class="text-center">
                <a href="<?php echo e(route('cart')); ?>" class="<?php echo e(request()->is('cart') ? 'active1' : ''); ?>">
                    <div class="">
                        <i class="fa-light fa-bag-shopping position-relative">
                            <?php if(Auth::user() && Auth::user()->type == 2): ?>
                            <span class="qut_counter"><?php echo e(helper::get_user_cart()); ?></span>
                            <?php endif; ?>
                        </i>
                    </div>
                    <p class="mb-0"><?php echo e(trans('labels.cart')); ?></p>
                </a>
            </li>
            <?php if(@helper::checkaddons('customer_login')): ?>
                <?php if(helper::appdata()->login_required == 1): ?>
                    <li class="text-center">
                        <a href="<?php echo e(Auth::user() ? route('user-favouritelist') : route('login')); ?>"
                            class="<?php echo e(request()->is('favouritelist') ? 'active1' : ''); ?>">
                            <i class="fa-light fa-heart"></i>
                            <p class="mb-0"><?php echo e(trans('labels.wishlist')); ?></p>
                        </a>
                    </li>
                    <li class="text-center">
                        <a href="<?php echo e(Auth::user() ? route('user-profile') : route('login')); ?>"
                            class="<?php echo e(request()->is('profile') ? 'active1' : ''); ?>">
                            <i class="fa-light fa-user"></i>
                            <p class="mb-0"><?php echo e(trans('labels.account')); ?></p>
                        </a>
                    </li>
                <?php endif; ?>
            <?php endif; ?>
        </ul>
    </div>
</div>

<div class="offcanvas <?php echo e(session()->get('direction') == '2' ? 'offcanvas-end' : 'offcanvas-start'); ?>" tabindex="-1"
    id="footersiderbar" aria-labelledby="footersiderbar">
    <div class="offcanvas-header justify-content-between border-bottom">
        <img src="<?php echo e(helper::image_path(@helper::appdata()->logo)); ?>" height="50" alt="footer_logo">
        <button type="button" class="btn-close shadow m-0" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
        <h5 class="text-dark text-capitalize border-bottom pb-3 m-0 fw-600">
            <?php echo e(trans('labels.pages')); ?>

        </h5>
        <ul class="list-group list-add list-group-flush border-bottom">
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('categories')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.menu')); ?>

                </a>
            </li>
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('faq')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.faq')); ?>

                </a>
            </li>
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('contact-us')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.help_contact_us')); ?>

                </a>
            </li>
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('gallery')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.gallery')); ?>

                </a>
            </li>
            <?php if(@helper::checkaddons('blog')): ?>
                <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                    <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('blogs')); ?>">
                        <i class="fa-solid fa-circle-dot fs-7"></i>
                        <?php echo e(trans('labels.blogs')); ?>

                    </a>
                </li>
            <?php endif; ?>
        </ul>
        <h5 class="text-dark text-capitalize border-bottom py-3 m-0 fw-600">
            <?php echo e(trans('labels.other')); ?>

        </h5>
        <ul class="list-group list-add list-group-flush border-bottom">
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('about-us')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.about')); ?>

                </a>
            </li>
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('privacy-policy')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.privacy_policy')); ?>

                </a>
            </li>
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('refund-policy')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.refund_policy')); ?>

                </a>
            </li>
            <li class="list-group-item px-0 py-3 <?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="<?php echo e(route('terms-conditions')); ?>">
                    <i class="fa-solid fa-circle-dot fs-7"></i>
                    <?php echo e(trans('labels.terms_condition')); ?>

                </a>
            </li>
        </ul>
        <h5 class="text-dark text-capitalize py-3 m-0 fw-600">Get in Touch with Us</h5>
        <ul class="">
            <li class="py-2">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="callto:<?php echo e(helper::appdata()->mobile); ?>">
                    <i class="fa-solid fa-phone fs-7"></i>
                    <?php echo e(helper::appdata()->mobile); ?>

                </a>
            </li>
            <li class="py-2">
                <a class="fs-7 fw-500 d-flex gap-2 align-items-center" href="mailto:<?php echo e(helper::appdata()->email); ?>">
                    <i class="fa-solid fa-envelope fs-7"></i>
                    <?php echo e(helper::appdata()->email); ?>

                </a>
            </li>
        </ul>
        <?php if(helper::sociallinks()->count() > 0): ?>
            <div class="social-media">
                <h5 class="text-dark text-capitalize pt-3 m-0 mt-3 fw-600 border-top">Follow us</h5>
                <div class="d-flex flex-wrap gap-2 mt-3">
                    <?php $__currentLoopData = helper::sociallinks(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $sociallink): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="footer-box">
                            <a class="text-white" href="<?php echo e($sociallink->link); ?>" target="_blank">
                                <?php echo $sociallink->icon; ?> </a>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            </div>
            <!-- Social media icon -->
        <?php endif; ?>
        <hr class="mt-4 text-white mb-0">
    </div>
    <div class="offcanvas-footer border-top">
        <p class="m-0 fs-7 text-center text-light fw-500 px-2 py-2">
            <?php echo e(helper::appdata()->copyright); ?>

        </p>
    </div>
</div>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/layout/header.blade.php ENDPATH**/ ?>