<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.my_cart')); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
    <style>
        .menu-background {
            background-image: url('<?php echo e(url(env('ASSETSPATHURL') . 'web-assets/images/website-bg.jpg')); ?>');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            min-height: 100vh;
            padding-top: 20px;
        }
    </style>
    <div class="breadcrumb-sec">
        <div class="container">
            <div class="breadcrumb-sec-content">
                <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li
                            class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?>">
                            <a class="text-dark fw-600" href="<?php echo e(route('home')); ?>"><?php echo e(trans('labels.home')); ?></a>
                        </li>
                        <li class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?> active"
                            aria-current="page"><?php echo e(trans('labels.cart')); ?></li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <div class="menu-background">
        <section>
        <div class="container">
            <div class="cart-view my-5">
                <?php if(count($getcartlist) > 0): ?>
                    <div class="row">
                        <div class="col-lg-12 col-md-12 col-sm-12 col-12">
                            <?php if(@helper::checkaddons('cart_checkout_countdown')): ?>
                                <?php echo $__env->make('web.cart_checkout_countdown', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            <?php endif; ?>
                            <div class="card px-0 overflow-hidden border-bottom-0 rounded-3">
                                <div class="table-responsive">
                                    <table class="table m-0">
                                        <thead class="table-light bg-primary">
                                            <tr>
                                                <th class="cart-table-title p-3 text-white">
                                                    <?php echo e(trans('labels.item')); ?>

                                                </th>
                                                <th class="cart-table-title p-3 text-white">
                                                    <?php echo e(trans('labels.price')); ?>

                                                </th>
                                                <th class="cart-table-title p-3 text-white">
                                                    <?php echo e(trans('labels.qty')); ?></th>
                                                <th class="cart-table-title p-3 text-white">
                                                    <?php echo e(trans('labels.total')); ?></th>
                                                <th class="cart-table-title p-3 text-white text-center">
                                                    <?php echo e(trans('labels.action')); ?>

                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php
                                                $order_total = 0;
                                                $total_item_qty = 0;
                                            ?>
                                            <?php $__currentLoopData = $getcartlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cartitems): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                <tr>
                                                    <td>
                                                        <div class="tbl_cart_product gap-3">
                                                            <div
                                                                class="col-auto d-none d-md-flex  justify-content-center item-img-none">
                                                                <div class="item-img">
                                                                    <img src="<?php echo e(helper::image_path($cartitems->item_image)); ?>"
                                                                        alt="item-image">
                                                                </div>
                                                            </div>
                                                            <div class="tbl_cart_product_caption">
                                                                <div class="d-flex gap-1 align-items-center mb-1">
                                                                    <img <?php if($cartitems->item_type == 1): ?> src="<?php echo e(helper::image_path('veg.svg')); ?>" <?php else: ?> src="<?php echo e(helper::image_path('nonveg.svg')); ?>" <?php endif; ?>
                                                                        class="item-type-image" alt="">
                                                                    <h5 class="tbl_pr_title line-2 m-0 fs-6">
                                                                        <?php echo e($cartitems->item_name); ?>

                                                                    </h5>
                                                                </div>
                                                                <?php if($cartitems->addons_id != '' || $cartitems->extras_id != ''): ?>
                                                                    <small>
                                                                        <a class="text-muted fw-400 fs-7"
                                                                            href="javascript:void(0)"
                                                                            onclick="showaddons('<?php echo e($cartitems['addons_name']); ?>','<?php echo e($cartitems['addons_price']); ?>','<?php echo e($cartitems['extras_name']); ?>','<?php echo e($cartitems['extras_price']); ?>','<?php echo e($cartitems['item_name']); ?>')"><?php echo e(trans('labels.customize')); ?>

                                                                        </a>
                                                                    </small>
                                                                    <br>
                                                                <?php endif; ?>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <?php
                                                        $total_price =
                                                            ($cartitems->item_price +
                                                                $cartitems->addons_total_price +
                                                                $cartitems->extras_total_price) *
                                                            $cartitems->qty;
                                                        $order_total += (float) $total_price;
                                                        $total_item_qty += $cartitems->qty;
                                                    ?>
                                                    <td>
                                                        <h4 class="tbl_org_price">
                                                            <?php echo e(helper::currency_format($cartitems->item_price + $cartitems->addons_total_price + $cartitems->extras_total_price)); ?>

                                                        </h4>
                                                    </td>
                                                    <td>
                                                        <nav aria-label="Page navigation example">
                                                            <ul
                                                                class="qtladd mb-0 <?php echo e(session()->get('direction') == '2' ? 'rtl' : ''); ?>">
                                                                <li>
                                                                    <button class="qty_button"
                                                                        onclick="qtyupdate('<?php echo e($cartitems['id']); ?>','minus','<?php echo e(URL::to('/cart/qtyupdate')); ?>')">
                                                                        <span aria-hidden="true">
                                                                            <i class="fa-light fa-minus fs-10"></i>
                                                                        </span>
                                                                    </button>
                                                                </li>
                                                                <li class="qtl-count">
                                                                    <input type="text" class="border py-1 w-100"
                                                                        id="number_<?php echo e($cartitems->id); ?>" name="number"
                                                                        value="<?php echo e($cartitems->qty); ?>" readonly="">
                                                                </li>
                                                                <li>
                                                                    <button class="qty_button"
                                                                        onclick="qtyupdate('<?php echo e($cartitems['id']); ?>','plus','<?php echo e(URL::to('/cart/qtyupdate')); ?>')">
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
                                                            <?php echo e(helper::currency_format($total_price)); ?>

                                                        </h4>
                                                    </td>
                                                    <td>
                                                        <div class="tbl_pr_action">
                                                            <a class="tbl_remove"
                                                                onclick="deletecartitem('<?php echo e($cartitems['id']); ?>','<?php echo e(URL::to('/cart/deleteitem')); ?> ')  ">
                                                                <i class="fa-light fa-trash-can fs-7"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p class="text-white text-end fs-7 line-2 mt-2"><?php echo e(trans('labels.cart_text_message')); ?></p>
                            <?php if(@helper::checkaddons('cart_checkout_progressbar')): ?>
                                <?php echo $__env->make('web.cart_checkout_progressbar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            <?php endif; ?>
                            <div class="row g-3 justify-content-between mt-0 align-items-center">
                                <div
                                    class="col-xl-3 col-lg-4 col-sm-6 col-12 <?php echo e(session()->get('direction') == '2' ? 'text-end' : ''); ?>">
                                    <a href="<?php echo e(URL::to('/menus')); ?>" class="btn btn-primary w-100">
                                        <i
                                            class="fa-solid <?php echo e(session()->get('direction') == '2' ? 'fa-circle-arrow-right ms-2' : 'fa-circle-arrow-left me-2'); ?>"></i>
                                        <?php echo e(trans('labels.continue_shopping')); ?></a>
                                </div>
                                <div
                                    class="col-xl-3 col-lg-4 col-sm-6 col-12 <?php echo e(session()->get('direction') == '2' ? 'text-start' : 'text-end'); ?>">
                                    <button
                                        class="btn btn-primary w-100 d-flex gap-3 justify-content-center align-items-center cart_checkout"
                                        onclick="isopenclose('<?php echo e(URL::to('/isopenclose')); ?>','<?php echo e($total_item_qty); ?>','<?php echo e($order_total); ?>')">
                                        <?php echo e(trans('labels.checkout')); ?>

                                        <div class="loader d-none cart_checkout_loader"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php else: ?>
                    <?php echo $__env->make('web.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                <?php endif; ?>
            </div>
        </div>
    </section>
    </div>
    <input type="hidden" name="request_url" id="request_url" value="<?php echo e(request()->segments()[0]); ?>">

    <?php echo $__env->make('web.subscribeform', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('scripts'); ?>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'web-assets/js/custom/cart.js')); ?>"></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/cart/cart.blade.php ENDPATH**/ ?>