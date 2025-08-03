<div class="user-sidebar">
    <div class="user-info d-xl-flex gap-2 pb-4 mb-3">
        <div class="col-xl-3 col-12 mb-xl-0 mb-3">
            <div class="avatar-upload mx-auto d-flex justify-content-center">
                <div class="avatar-preview-two ">
                    <div id="imagepreview-two">
                        <img src="<?php echo e(helper::image_path(Auth::user()->profile_image)); ?>" alt="">
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex align-items-center">
            <div class="col-12">
                <p
                    class="mb-0 text-center fw-600 <?php echo e(session()->get('direction') == '2' ? 'text-xl-end' : 'text-xl-start'); ?>">
                    <?php echo e(Auth::user()->name); ?></p>
                <p class="mb-0 text-center <?php echo e(session()->get('direction') == '2' ? 'text-xl-end' : 'text-xl-start'); ?>">
                    <?php echo e(Auth::user()->email); ?></p>
            </div>
        </div>
    </div>

    <li>
        <a class="<?php echo e(request()->is('profile') ? 'active' : ''); ?>" href="<?php echo e(route('user-profile')); ?>">
            <i class="mx-2 fa-regular fa-user"></i><?php echo e(trans('labels.my_profile')); ?> </a>
    </li>
    <li>
        <a class="<?php echo e(request()->is('orders*') ? 'active' : ''); ?>" href="<?php echo e(route('order-history')); ?>">
            <i class="mx-2 fa fa-list-check"></i><?php echo e(trans('labels.my_orders')); ?> </a>
    </li>
    <li>
        <a class="<?php echo e(request()->is('favouritelist') ? 'active' : ''); ?>" href="<?php echo e(route('user-favouritelist')); ?>">
            <i class="mx-2 fa-regular fa-heart"></i><?php echo e(trans('labels.favourite_list')); ?> </a>
    </li>

    <?php if(helper::appdata()->pickup_delivery != 3): ?>




    <?php endif; ?>

    <?php if(helper::allpaymentcheckaddons()): ?>
        <li>
            <a class="<?php echo e(request()->is('wallet*') ? 'active' : ''); ?>" href="<?php echo e(route('user-wallet')); ?>">
                <i class="mx-2 fa-solid fa-wallet"></i><?php echo e(trans('labels.my_wallet')); ?> </a>
        </li>
    <?php endif; ?>




    <li>
        <a href="javascript:void(0)"
            onclick="logout('<?php echo e(route('logout')); ?>','<?php echo e(trans('messages.are_you_sure_logout')); ?>','<?php echo e(trans('labels.logout')); ?>')">
            <i class="mx-2 fa fa-arrow-right-from-bracket"></i><?php echo e(trans('labels.logout')); ?> </a>
    </li>
</div>


<div class="profile-menu border rounded-3 my-3 d-block d-lg-none">
    <div class="accordion-item">
        <h2 class="accordion-header rounded-3">
            <button class="accordion-button rounded-3 bg-primary p-3 collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false"
                aria-controls="panelsStayOpen-collapseTwo">
                <i class="mx-2 fa-solid fa-bars text-white"></i>
                <p class="text-white mb-0">Navigation</p>
            </button>
        </h2>
        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse" style="">
            <div class="accordion-body p-3">
                <ul class="w-100 text-start">
                    <li class="mb-3 <?php echo e(request()->is('profile') ? 'active' : ''); ?>">
                        <a class="text-black" href="<?php echo e(route('user-profile')); ?>">
                            <i
                                class="fa-regular fa-user <?php echo e(session()->get('direction') == '2' ? 'ms-2' : 'me-2'); ?>"></i><?php echo e(trans('labels.my_profile')); ?>

                        </a>
                    </li>
                    <li class="mb-3 <?php echo e(request()->is('orders*') ? 'active' : ''); ?>">
                        <a class="text-black" href="<?php echo e(route('order-history')); ?>">
                            <i
                                class="fa fa-list-check <?php echo e(session()->get('direction') == '2' ? 'ms-2' : 'me-2'); ?>"></i><?php echo e(trans('labels.my_orders')); ?>

                        </a>
                    </li>
                    <li class="mb-3 <?php echo e(request()->is('favouritelist') ? 'active' : ''); ?>">
                        <a class="text-black" href="<?php echo e(route('user-favouritelist')); ?>">
                            <i
                                class="fa-regular fa-heart <?php echo e(session()->get('direction') == '2' ? 'ms-2' : 'me-2'); ?>"></i><?php echo e(trans('labels.favourite_list')); ?>

                        </a>
                    </li>
                    <?php if(helper::appdata()->pickup_delivery != 3): ?>






                    <?php endif; ?>
                    <?php if(helper::allpaymentcheckaddons()): ?>
                        <li class="mb-3 <?php echo e(request()->is('wallet*') ? 'active' : ''); ?>">
                            <a class="text-black" href="<?php echo e(route('user-wallet')); ?>">
                                <i
                                    class="fa-solid fa-wallet <?php echo e(session()->get('direction') == '2' ? 'ms-2' : 'me-2'); ?>"></i><?php echo e(trans('labels.my_wallet')); ?>

                            </a>
                        </li>
                    <?php endif; ?>






                    <li class="mb-3">
                        <a href="javascript:void(0)" class="text-black"
                            onclick="logout('<?php echo e(route('logout')); ?>','<?php echo e(trans('messages.are_you_sure_logout')); ?>','<?php echo e(trans('labels.logout')); ?>')">
                            <i
                                class="fa fa-arrow-right-from-bracket <?php echo e(session()->get('direction') == '2' ? 'ms-2' : 'me-2'); ?>"></i><?php echo e(trans('labels.logout')); ?>

                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/layout/usersidebar.blade.php ENDPATH**/ ?>