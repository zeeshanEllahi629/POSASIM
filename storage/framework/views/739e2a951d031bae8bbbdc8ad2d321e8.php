<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.checkout')); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
    <?php
        $todayDate = \Carbon\Carbon::now()->format('Y-m-d');
    ?>
    <style>
        .fade-in {
            animation: fadeIn 0.5s ease-in-out forwards;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
    <div class="breadcrumb-sec">
        <div class="container">
            <div class="breadcrumb-sec-content">
                <nav class="text-dark d-flex breadcrumb-divider" aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li
                            class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?>">
                            <a class="text-dark fw-bold" href="<?php echo e(URL::to('/')); ?>"><?php echo e(trans('labels.home')); ?></a>
                        </li>
                        <li class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?> text-primary fw-bold active"
                            aria-current="page"><?php echo e(trans('labels.checkout')); ?></li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <?php if(count($getcartlist) > 0): ?>
        <?php
            $totaltax = 0;
            $order_total = 0;
            $total_item_qty = 0;
            $totalcarttax = 0;
        ?>
        <?php $__currentLoopData = $taxArr['tax']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $tax): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php
                $rate = $taxArr['rate'][$k];
                $totalcarttax += (float) $taxArr['rate'][$k];
            ?>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <?php $__currentLoopData = $getcartlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $item): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <?php
                $total_price =
                    ($item['item_price'] + $item['addons_total_price'] + $item['extras_total_price']) * $item['qty'];
                $order_total += (float) $total_price;
                $total_item_qty += $item['qty'];
            ?>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        <div class="menu-background">
            <section class="my-5">
            <div class="container">
                <?php if(@helper::checkaddons('cart_checkout_countdown')): ?>
                    <?php echo $__env->make('web.cart_checkout_countdown', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                <?php endif; ?>
                <div class="cart-view">
                    <div class="row g-3">
                        <div class="col-lg-2 order-md3">

                        </div>
                        <div class="col-lg-4 order-md2">
                            <div class="card mb-3 order-option d-none">
                                <div class="card-body">
                                    <div class="">
                                        <div class="heading mb-2 border-bottom">
                                            <h5><?php echo e(trans('labels.order_type')); ?></h5>
                                        </div>
                                        <div class="col-12 d-flex gap-3">
                                            <?php if($getsettings->pickup_delivery == 1): ?>
                                                <div class="form-check form-check-inline mb-0">
                                                    <input class="form-check-input" type="radio" name="order_type"
                                                        value="1" <?php echo e(session()->get('order_type') == 1 ? "checked": ""); ?> id="delivery">
                                                    <label class="form-check-label fs-7 fw-500" for="delivery">
                                                        <?php echo e(trans('labels.delivery')); ?>

                                                    </label>
                                                </div>
                                                <div class="form-check form-check-inline mb-0">
                                                    <input class="form-check-input" type="radio" name="order_type"
                                                        value="2" <?php echo e(session()->get('order_type') == 2 ? "checked": ""); ?> id="pickup">
                                                    <label class="form-check-label fs-7 fw-500" for="pickup">
                                                        <?php echo e(trans('labels.take_away')); ?>

                                                    </label>
                                                </div>
                                            <?php elseif($getsettings->pickup_delivery == 2): ?>
                                                <div class="form-check form-check-inline mb-0">
                                                    <input class="form-check-input" type="radio" name="order_type"
                                                        value="1" checked id="delivery">
                                                    <label class="form-check-label fs-7 fw-500" for="delivery">
                                                        <?php echo e(trans('labels.delivery')); ?>

                                                    </label>
                                                </div>
                                            <?php elseif($getsettings->pickup_delivery == 3): ?>
                                                <div class="form-check form-check-inline mb-0">
                                                    <input class="form-check-input" type="radio" name="order_type"
                                                        value="2" id="pickup" checked>
                                                    <label class="form-check-label fs-7 fw-500" for="pickup">
                                                        <?php echo e(trans('labels.take_away')); ?>

                                                    </label>
                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php if(helper::appdata()->ordertype_date_time == 1): ?>
                                <div class="card mb-3 date-view d-none">
                                    <div class="card-body">
                                        <div class="heading mb-3 border-bottom">
                                            <h5><?php echo e(trans('labels.date_time')); ?></h5>
                                        </div>
                                        <div class="row g-3">
                                            <div
                                                class="col-sm-6 delivery-date <?php echo e(session()->get('direction') == '2' ? 'text-right' : ''); ?>">
                                                <label id="delivery_date"
                                                    class="form-label justify-content-start"><?php echo e(trans('labels.delivery_date')); ?>

                                                    <span class="text-danger">*</span>
                                                </label>
                                                <label id="pickup_date" class="form-label d-none">
                                                    <?php echo e(trans('labels.pickup_date')); ?>

                                                    <span class="text-danger">*</span>
                                                </label>
                                                <input type="text"
                                                    class="form-control rounded-2 p-3 delivery_pickup_date"
                                                    name="delivery_date" value="<?php echo e(old('delivery_date')); ?>"
                                                    id="delivery_dt" min="<?php echo date('Y-m-d'); ?>">
                                            </div>
                                            <div
                                                class="col-sm-6 delivery-time <?php echo e(session()->get('direction') == '2' ? 'text-right' : ''); ?>">
                                                <label id="delivery_time"
                                                    class="form-label justify-content-start"><?php echo e(trans('labels.delivery_time')); ?>

                                                    <span class="text-danger">*</span>
                                                </label>
                                                <label id="pickup_time"
                                                    class="form-label justify-content-start d-none"><?php echo e(trans('labels.pickup_time')); ?>

                                                    <span class="text-danger">*</span>
                                                </label>
                                                <label id="store_close"
                                                    class="d-none form-label text-danger label14"><?php echo e(trans('messages.restaurant_closed')); ?></label>
                                                <select name="delivery_time" id="delivery_slot_time"
                                                    class="form-select rounded-2 py-3">
                                                    <option value="<?php echo e(old('delivery_time')); ?>">
                                                        <?php echo e(trans('labels.select')); ?>

                                                    </option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="card mb-3">
                                <div class="card-body">
                                    <div class="heading mb-2 border-bottom">
                                        <h5><?php echo e(trans('labels.customer_info')); ?></h5>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="first_name" class="form-label"><?php echo e(trans('labels.first_name')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="first_name" id="first_name"
                                                placeholder="<?php echo e(trans('labels.first_name')); ?>"
                                                value="<?php echo e(Auth::user() && Auth::user()->type == 2 ? Auth::user()->name : old('first_name')); ?>"
                                                required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="last_name" class="form-label"><?php echo e(trans('labels.last_name')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="last_name" id="last_name"
                                                placeholder="<?php echo e(trans('labels.last_name')); ?>"
                                                value="<?php echo e(old('last_name')); ?>" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="email" class="form-label"><?php echo e(trans('labels.email')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="email" id="email"
                                                placeholder="<?php echo e(trans('labels.email')); ?>"
                                                value="<?php echo e(Auth::user() && Auth::user()->type == 2 ? Auth::user()->email : old('email')); ?>"
                                                required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="mobile" class="form-label"><?php echo e(trans('labels.mobile')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control numbers_only" name="mobile"
                                                id="mobile" placeholder="<?php echo e(trans('labels.mobile')); ?>"
                                                value="<?php echo e(Auth::user() && Auth::user()->type == 2 ? Auth::user()->mobile : old('mobile')); ?>"
                                                required>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card mb-3" id="addressdiv">
                                <div class="card-body">
                                    <div
                                        class="d-flex justify-content-between align-items-center heading mb-2 border-bottom">
                                        <h5><?php echo e(trans('labels.delivery_address')); ?></h5>
                                    </div>
                                    <div class="row g-3">
                                        <?php if(Auth::user() && Auth::user()->type == 2): ?>
                                            <div class="col-md-9 col-sm-8">
                                                <?php if($getaddresses->count() > 0): ?>
                                                    <label class="form-label"><?php echo e(trans('labels.select_address')); ?></label>
                                                    <select name="address_type" id="address_type" class="form-select">
                                                        <?php $__currentLoopData = $getaddresses; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $address): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                            <option value="<?php echo e($address->id); ?>"
                                                                <?php echo e($address->is_default == 1 ? 'selected' : ''); ?>>
                                                                <?php echo e($address->title); ?></option>
                                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                    </select>
                                                <?php endif; ?>
                                            </div>






                                        <?php endif; ?>
                                        <div class="col-12">
                                            <label for="address" class="form-label"><?php echo e(trans('labels.address')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <textarea name="address" id="new_address" class="form-control" rows="2"
                                                placeholder="<?php echo e(trans('labels.address')); ?>" required><?php echo e(old('address')); ?></textarea>
                                        </div>
                                        <div class="col-md-6">
                                            <label for="landmark" class="form-label"><?php echo e(trans('labels.landmark')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="landmark" id="new_landmark"
                                                placeholder="<?php echo e(trans('labels.landmark')); ?>"
                                                value="<?php echo e(old('landmark')); ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="city" class="form-label"><?php echo e(trans('labels.city')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="city" id="new_city"
                                                placeholder="<?php echo e(trans('labels.city')); ?>" value="<?php echo e(old('city')); ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="state" class="form-label"><?php echo e(trans('labels.state')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="state" id="new_state"
                                                placeholder="<?php echo e(trans('labels.state')); ?>" value="<?php echo e(old('state')); ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="country" class="form-label"><?php echo e(trans('labels.country')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="country" id="new_country"
                                                placeholder="<?php echo e(trans('labels.country')); ?>"
                                                value="<?php echo e(old('country')); ?>">
                                        </div>
                                        <div class="col-md-6">
                                            <label for="pincode" class="form-label"><?php echo e(trans('labels.pincode')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input type="text" class="form-control" name="pincode" id="new_pincode"
                                                placeholder="<?php echo e(trans('labels.pincode')); ?>"
                                                value="<?php echo e(old('pincode')); ?>">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php if(@helper::checkaddons('vendor_tip')): ?>
                                <?php if(@helper::otherappdata()->tips_settings == 1): ?>
                                    <div class="card mb-3 Delivery-view">
                                        <div class="card-body">
                                            <div
                                                class="d-flex justify-content-between align-items-center heading mb-2 border-bottom">
                                                <h5><?php echo e(trans('labels.tips_pro')); ?></h5>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-12">
                                                    <div class="form-group m-0">
                                                        <label for="add_amount" class="form-label">
                                                            <?php echo e(trans('labels.add_amount')); ?>

                                                        </label>
                                                        <input type="text" class="form-control numbers_only"
                                                            id="add_amount"
                                                            placeholder="<?php echo e(trans('labels.add_amount')); ?> . . . .">
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            <?php endif; ?>
                        </div>
                        <div class="col-lg-4 order-md1">
                            <!-- payment-summary -->
                            <div class="summary py-3 mb-4">
                                <h2 class="border-bottom"><?php echo e(trans('labels.payment_summary')); ?></h2>
                                <div class="bill-details border-bottom pb-2">
                                    <div class="row justify-content-between align-items-center">
                                        <div class="col-auto"><span><?php echo e(trans('labels.subtotal')); ?></span></div>
                                        <div class="col-auto">
                                            <span><?php echo e(helper::currency_format($order_total)); ?></span>
                                        </div>
                                    </div>
                                    <?php
                                        if (session()->has('discount_data')) {
                                            $discount_amount = session()->get('discount_data')['offer_amount'];
                                        } else {
                                            $discount_amount = 0;
                                        }
                                    ?>

                                    <div class="row justify-content-between align-items-center d-none"
                                         id="discount_section_display">
                                        <div class="col-auto">
                                            <span><?php echo e(trans('labels.discount')); ?></span>
                                        </div>
                                        <div class="col-auto">
                                            <span id="offer_amount">-
                                                <?php echo e(helper::currency_format($discount_amount)); ?></span>
                                        </div>
                                    </div>
                                    <?php
                                        $totalcarttax = 0;
                                    ?>
                                    <?php $__currentLoopData = $taxArr['tax']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $k => $tax): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <?php
                                            $rate = $taxArr['rate'][$k];
                                            $totalcarttax += (float) $taxArr['rate'][$k];
                                        ?>

                                        <div class="row justify-content-between align-items-center">
                                            <div class="col-auto"><span><?php echo e($tax); ?></span></div>
                                            <div class="col-auto">
                                                <span> <?php echo e(helper::currency_format($rate)); ?></sp>
                                            </div>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

                                    <div class="row justify-content-between align-items-center" id="delivery_charge">
                                        <div class="col-auto">
                                            <span class=""><?php echo e(trans('labels.delivery')); ?></span>
                                        </div>
                                        <div class="col-auto">
                                            <?php if(@helper::checkaddons('shipping_area')): ?>
                                                <?php if(helper::appdata()->shipping_area == 1): ?>
                                                    <?php if(count($allshippingarea) > 0): ?>
                                                        <?php
                                                            $grand_total =
                                                                $order_total - $discount_amount + $totalcarttax;
                                                        ?>
                                                        <?php if($order_total >= helper::appdata()->min_order_amount_for_free_shipping): ?>
                                                            <input type="hidden" name="shipping_charge"
                                                                   id="shipping_charge" value="0">
                                                            <span>
                                                                <?php echo e(trans('labels.free')); ?>

                                                            </span>
                                                        <?php else: ?>
                                                            <input type="hidden" name="shipping_charge"
                                                                   id="shipping_charge" value="0">
                                                            <span id="delivery_amount">
                                                                <?php echo e(helper::currency_format(0)); ?>

                                                            </span>
                                                        <?php endif; ?>
                                                    <?php else: ?>
                                                        <?php if($order_total >= helper::appdata()->min_order_amount_for_free_shipping): ?>
                                                            <?php
                                                                $grand_total =
                                                                    $order_total - $discount_amount + $totalcarttax;
                                                            ?>
                                                            <input type="hidden" name="shipping_charge"
                                                                   id="shipping_charge" value="0">
                                                            <span>
                                                                <?php echo e(trans('labels.free')); ?>

                                                            </span>
                                                        <?php else: ?>
                                                            <?php
                                                                $grand_total =
                                                                    $order_total -
                                                                    $discount_amount +
                                                                    $totalcarttax +
                                                                    helper::appdata()->shipping_charges;
                                                            ?>
                                                            <input type="hidden" name="shipping_charge"
                                                                   id="shipping_charge"
                                                                   value="<?php echo e(helper::appdata()->shipping_charges); ?>">
                                                            <span id="delivery_amount">
                                                                <?php echo e(helper::currency_format(helper::appdata()->shipping_charges)); ?>

                                                            </span>
                                                        <?php endif; ?>
                                                    <?php endif; ?>
                                                <?php else: ?>
                                                    <?php if($order_total >= helper::appdata()->min_order_amount_for_free_shipping): ?>
                                                        <?php
                                                            $grand_total =
                                                                $order_total - $discount_amount + $totalcarttax;
                                                        ?>
                                                        <input type="hidden" name="shipping_charge" id="shipping_charge"
                                                               value="0">
                                                        <span>
                                                            <?php echo e(trans('labels.free')); ?>

                                                        </span>
                                                    <?php else: ?>
                                                        <?php
                                                            $grand_total =
                                                                $order_total -
                                                                $discount_amount +
                                                                $totalcarttax +
                                                                helper::appdata()->shipping_charges;
                                                        ?>
                                                        <input type="hidden" name="shipping_charge" id="shipping_charge"
                                                               value="<?php echo e(helper::appdata()->shipping_charges); ?>">
                                                        <span id="delivery_amount">
                                                            <?php echo e(helper::currency_format(helper::appdata()->shipping_charges)); ?>

                                                        </span>
                                                    <?php endif; ?>
                                                <?php endif; ?>
                                            <?php else: ?>
                                                <?php if($order_total >= helper::appdata()->min_order_amount_for_free_shipping): ?>
                                                    <?php
                                                        $grand_total = $order_total - $discount_amount + $totalcarttax;
                                                    ?>
                                                    <input type="hidden" name="shipping_charge" id="shipping_charge"
                                                           value="0">
                                                    <span>
                                                        <?php echo e(trans('labels.free')); ?>

                                                    </span>
                                                <?php else: ?>
                                                    <?php
                                                        $grand_total =
                                                            $order_total -
                                                            $discount_amount +
                                                            $totalcarttax +
                                                            helper::appdata()->shipping_charges;
                                                    ?>
                                                    <input type="hidden" name="shipping_charge" id="shipping_charge"
                                                           value="<?php echo e(helper::appdata()->shipping_charges); ?>">
                                                    <span id="delivery_amount">
                                                        <?php echo e(helper::currency_format(helper::appdata()->shipping_charges)); ?>

                                                    </span>
                                                <?php endif; ?>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                                <div class="bill-total mt-2">
                                    <div class="row justify-content-between align-items-center">
                                        <div class="col-auto"><span><?php echo e(trans('labels.grand_total')); ?></span></div>
                                        <div class="col-auto"><span class="grand_total"
                                                                    id="total_amount"><?php echo e(helper::currency_format($grand_total)); ?></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php if(@helper::checkaddons('coupon')): ?>
                                <div class="promocode mb-4 py-3 card">
                                    <div class="d-flex pb-2 border-bottom justify-content-between align-items-center mb-3">
                                        <div class="col-auto">
                                            <label for="offer_code"><?php echo e(trans('labels.apply_promo')); ?></label>
                                        </div>
                                    </div>
                                    <div class="row justify-content-between align-items-center">
                                        <div class="d-flex">
                                            <input type="text" class="form-control" name="offer_code"
                                                value="<?php echo e(@Session::get('discount_data')['offer_code']); ?>"
                                                id="offer_code" placeholder="<?php echo e(trans('labels.have_promocode')); ?>"
                                                readonly>
                                            <button
                                                class="btn btn-primary border-0 mb-0 px-sm-4 px-2 py-2 d-flex gap-3 justify-content-center align-items-center <?php echo e(session()->get('direction') == '2' ? 'me-2' : 'ms-2'); ?> d-none"
                                                id="btnremove" onclick="RemoveCoupon()"><?php echo e(trans('labels.remove')); ?>

                                                <div class="loader d-none" id="remove_code_loader"></div>
                                            </button>

                                            <button
                                                class="btn btn-primary border-0 mb-0 px-sm-4 px-2 py-2 d-flex gap-3 justify-content-center align-items-center <?php echo e(session()->get('direction') == '2' ? 'me-2' : 'ms-2'); ?> d-block"
                                                id="btnapply" onclick="ApplyCoupon()"><?php echo e(trans('labels.apply')); ?>

                                                <div class="loader d-none" id="apply_code_loader"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            <?php endif; ?>

                            <?php if(@helper::checkaddons('shipping_area')): ?>
                                <?php if(helper::appdata()->shipping_area == 1): ?>
                                    <div class="promocode mb-4 py-3" id="shippinginfodiv">
                                        <div
                                            class="d-flex pb-2 border-bottom justify-content-between align-items-center mb-3">
                                            <label><?php echo e(trans('labels.shipping_area')); ?></label>
                                        </div>
                                        <div class="row justify-content-between align-items-center">
                                            <div class="d-flex">
                                                <select name="shipping_area" id="shipping_area" class="form-select">
                                                    <option value="" selected disabled>
                                                        <?php echo e(trans('labels.select')); ?>

                                                    </option>
                                                    <?php $__currentLoopData = $allshippingarea; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $shippingarea): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                        <option value="<?php echo e($shippingarea->id); ?>"
                                                            data-delivery-charge="<?php echo e($shippingarea->delivery_charge); ?>"
                                                            data-area-name="<?php echo e($shippingarea->area_name); ?>">
                                                            <?php echo e($shippingarea->area_name); ?>

                                                            <?php if(helper::appdata()->min_order_amount_for_free_shipping > $order_total): ?>
                                                                <?php if($shippingarea->delivery_charge > 0): ?>
                                                                    <?php echo e(trans('labels.delivery_charge')); ?> :
                                                                    <?php echo e(helper::currency_format($shippingarea->delivery_charge)); ?>

                                                                <?php endif; ?>
                                                            <?php else: ?>
                                                                <?php echo e(trans('labels.free_delivery')); ?>

                                                            <?php endif; ?>
                                                        </option>
                                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                <?php endif; ?>
                            <?php endif; ?>
                            <!-- special-instruction -->
                            <div class="special-instruction mb-3 border d-none">
                                <label class="form-label mb-3 border-bottom pb-2 w-100"
                                    for="order_notes"><?php echo e(trans('labels.special_instruction')); ?></label>
                                <textarea class="form-control" name="order_notes" id="order_notes" rows="3"
                                    placeholder="<?php echo e(trans('labels.special_instruction')); ?>"></textarea>
                            </div>
                                <div class="payment-option mb-3 border d-none">
                                    <div class="heading mb-2 border-bottom">
                                        <h2><?php echo e(trans('labels.choose_payment')); ?></h2>
                                    </div>
                                    <!-- payment-options -->
                                    <?php echo $__env->make('web.paymentmethodsview', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    <div class="row g-3 justify-content-between mt-4 align-items-center">




                                        <div class="align-items-center col-sm-12 col-12">
                                            <button
                                                    class="btn btn-primary w-100 d-flex gap-3 justify-content-center align-items-center checkout"
                                                    onclick="isopenclose('<?php echo e(URL::to('/isopenclose')); ?>','<?php echo e($total_item_qty); ?>','<?php echo e($order_total); ?>')">
                                                <?php echo e(trans('labels.place_order')); ?>

                                                <div class="loader d-none checkout_loader"></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            <?php echo $__env->make('web.service-trusted', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                        </div>
                        <div class="col-lg-2 order-md3">

                        </div>
                    </div>
                </div>


                <input type="hidden" name="user_id" id="user_id" value="<?php echo e(@Auth::user()->id); ?>">
                <input type="hidden" name="session_id" id="session_id" value="<?php echo e(@Session::getId()); ?>">
                <input type="hidden" name="order_type" id="order_type" value="<?php echo e(session()->get('order_type')); ?>">
                <input type="hidden" name="grand_total" id="grand_total"
                    value="<?php echo e(helper::currency_format($grand_total)); ?>">
                <input type="hidden" name="sub_total" id="sub_total" value="<?php echo e($order_total); ?>">
                <input type="hidden" name="discount" id="discount" value="<?php echo e($discount_amount); ?>">
                <input type="hidden" name="totaltaxamount" id="totaltaxamount" value="<?php echo e($totalcarttax); ?>">
                <input type="hidden" name="tax" id="tax" value="<?php echo e(implode('|', $taxArr['rate'])); ?>">
                <input type="hidden" name="tax_name" id="tax_name" value="<?php echo e(implode('|', $taxArr['tax'])); ?>">
                <input type="hidden" name="user_name" id="user_name" value="<?php echo e(@Auth::user()->name); ?>">
                <input type="hidden" name="user_email" id="user_email" value="<?php echo e(@Auth::user()->email); ?>">
                <input type="hidden" name="user_mobile" id="user_mobile" value="<?php echo e(@Auth::user()->mobile); ?>">
                <input type="hidden" name="buynow" id="buynow" value="<?php echo e(request()->get('buynow')); ?>">

                <input type="hidden" name="sloturl" id="sloturl" value="<?php echo e(URL::to('/timeslot')); ?>">
                <input type="hidden" name="orderurl" id="orderurl" value="<?php echo e(URL::to('placeorder')); ?>">
                <input type="hidden" name="paymentsuccess" id="paymentsuccess"
                    value="<?php echo e(URL::to('/paymentsuccess')); ?>">
                <input type="hidden" name="paymentfail" id="paymentfail" value="<?php echo e(URL::to('/paymentfail')); ?>">
                <input type="hidden" name="continueurl" id="continueurl" value="<?php echo e(URL::to('/')); ?>">
                <input type="hidden" name="environment" id="environment" value="<?php echo e(env('Environment')); ?>">
                <input type="hidden" name="myfatoorahurl" id="myfatoorahurl" value="<?php echo e(URL::to('/myfatoorah')); ?>">
                <input type="hidden" name="mercadopagourl" id="mercadopagourl"
                    value="<?php echo e(URL::to('/mercadorequest')); ?>">
                <input type="hidden" name="paypalurl" id="paypalurl" value="<?php echo e(URL::to('/paypal')); ?>">
                <input type="hidden" name="toyyibpayurl" id="toyyibpayurl" value="<?php echo e(URL::to('/toyyibpay')); ?>">
                <input type="hidden" name="paytaburl" id="paytaburl" value="<?php echo e(URL::to('/paytab')); ?>">
                <input type="hidden" name="phonepeurl" id="phonepeurl" value="<?php echo e(URL::to('/phonepe')); ?>">
                <input type="hidden" name="mollieurl" id="mollieurl" value="<?php echo e(URL::to('/mollie')); ?>">
                <input type="hidden" name="khaltiurl" id="khaltiurl" value="<?php echo e(URL::to('/khalti')); ?>">
                <input type="hidden" name="xenditurl" id="xenditurl" value="<?php echo e(URL::to('/xendit')); ?>">

                <input type="hidden" value="<?php echo e(URL::to('getaddress')); ?>" name="getaddress" id="getaddress">

                <input type="hidden" value="<?php echo e(trans('messages.delivery_date_required')); ?>"
                    name="delivery_date_message" id="delivery_date_message">
                <input type="hidden" value="<?php echo e(trans('messages.delivery_time_required')); ?>"
                    name="delivery_time_message" id="delivery_time_message">
                <input type="hidden" value="<?php echo e(trans('messages.pickup_date_required')); ?>" name="pickup_date_message"
                    id="pickup_date_message">
                <input type="hidden" value="<?php echo e(trans('messages.pickup_time_required')); ?>" name="pickup_time_message"
                    id="pickup_time_message">
                <input type="hidden" value="<?php echo e(trans('messages.first_name_required')); ?>" name="first_name_message"
                    id="first_name_message">
                <input type="hidden" value="<?php echo e(trans('messages.last_name_required')); ?>" name="last_name_message"
                    id="last_name_message">
                <input type="hidden" value="<?php echo e(trans('messages.email_required')); ?>" name="email_message"
                    id="email_message">
                <input type="hidden" value="<?php echo e(trans('messages.mobile_required')); ?>" name="mobile_message"
                    id="mobile_message">
                <input type="hidden" value="<?php echo e(trans('messages.address_required')); ?>" name="new_address_message"
                    id="new_address_message">
                <input type="hidden" value="<?php echo e(trans('messages.landmark_required')); ?>" name="new_landmark_message"
                    id="new_landmark_message">
                <input type="hidden" value="<?php echo e(trans('messages.pincode_required')); ?>" name="new_pincode_message"
                    id="new_pincode_message">
                <input type="hidden" value="<?php echo e(trans('messages.country_required')); ?>" name="new_country_message"
                    id="new_country_message">
                <input type="hidden" value="<?php echo e(trans('messages.state_required')); ?>" name="new_state_message"
                    id="new_state_message">
                <input type="hidden" value="<?php echo e(trans('messages.city_required')); ?>" name="new_city_message"
                    id="new_city_message">
                <input type="hidden" value="<?php echo e(trans('messages.payment_selection_required')); ?>"
                    name="payment_type_message" id="payment_type_message">
                <input type="hidden" value="<?php echo e(trans('messages.shipping_area_selection_required')); ?>"
                    name="shipping_area_message" id="shipping_area_message">

                <form action="<?php echo e(URL::to('paypal')); ?>" method="post" class="d-none">
                    <?php echo e(csrf_field()); ?>

                    <input type="hidden" name="return" value="2">
                    <input type="submit" class="callpaypal" name="submit">
                </form>
            </div>
        </section>
        </div>
    <?php else: ?>
        <?php echo $__env->make('web.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <?php endif; ?>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('scripts'); ?>
    <script src="https://checkout.stripe.com/v2/checkout.js"></script>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script src="https://checkout.flutterwave.com/v3.js"></script>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script>


        setTimeout(() => {
            const paymentOption = document.querySelector('.payment-option');
            paymentOption.classList.remove('d-none');
            paymentOption.classList.add('fade-in');
        }, 3000); // 3 seconds

        let locationData = localStorage.getItem('locationData');
        locationData = typeof locationData == "string" ? JSON.parse(locationData): locationData;
        if (locationData){
            $('#new_address').val(locationData.street);
            $('input[name=city]').val(locationData.city);
            $('input[name=state]').val(locationData.state);
            $('input[name=landmark]').val(locationData.landmark);
            $('input[name=country]').val(locationData.country);
            $('input[name=pincode]').val(locationData.zip_code);
        }

    </script>
    <script>

        $(function(){

            $('.delivery_pickup_date').val('<?php echo e($todayDate); ?>').trigger('change');

            let specialInstructions = localStorage.getItem('special_instructions');
            if(specialInstructions){
                $('#order_notes').val(specialInstructions);
            }
        });


        var select = "<?php echo e(trans('labels.select')); ?>";
        var stripeaddon = "<?php echo e(@helper::checkaddons('stripe')); ?>";
        var min_order_amount_for_free_shipping = "<?php echo e(helper::appdata()->min_order_amount_for_free_shipping); ?>";

        $(document).ready(function() {
            if ("<?php echo e(Session::has('discount_data')); ?>") {
                $('#discount_section_display').removeClass('d-none');
                $('#btnremove').removeClass('d-none');
                $('#btnapply').addClass('d-none');
            } else {
                $('#discount_section_display').addClass('d-none');
                $('#btnremove').addClass('d-none');
                $('#btnapply').removeClass('d-none');
            }
        });

        function ApplyCoupon() {
            $('#btnapply').prop("disabled", true);
            $('#apply_code_loader').removeClass('d-none');
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "<?php echo e(URL::to('/promocodes/apply')); ?>",
                method: 'post',
                data: {
                    offer_code: $('#offer_code').val(),
                    sub_total: $('#sub_total').val()
                },
                success: function(response) {
                    console.log(response);

                    $('#btnapply').prop("disabled", false);
                    $('#apply_code_loader').addClass('d-none');
                    if (response.status == 1) {
                        var total = parseFloat($('#sub_total').val());
                        var tax = "<?php echo e(@$totalcarttax); ?>";
                        var delivery_charge = parseFloat($('#shipping_charge').val());
                        var grandtotal = parseFloat(total) + parseFloat(tax) + parseFloat(delivery_charge) -
                            parseFloat(response.data.offer_amount);
                        $('#offer_amount').text('-' + currency_format(parseFloat(response.data.offer_amount)));
                        $('#total_amount').text(currency_format(parseFloat(grandtotal)));
                        $('#grand_total').val(grandtotal);
                        $('#discount').val(response.data.offer_amount);
                        $('#offer_code').val(response.data.offer_code);
                        $('#discount_section_display').removeClass('d-none');
                        $('#btnremove').removeClass('d-none');
                        $('#btnapply').addClass('d-none');
                    } else {
                        toastr.error(response.message);
                    }
                }
            });
        }

        function RemoveCoupon() {
            $('#btnremove').prop("disabled", true);
            $('#remove_code_loader').removeClass('d-none');
            setTimeout(function() {
                $('#remove_code_loader').addClass('d-none');
                $('#btnremove').prop("disabled", false);
            }, 3000);
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "<?php echo e(URL::to('/promocodes/remove')); ?>",
                method: 'post',
                data: {
                    offer_code: $('#offer_code').val()
                },
                success: function(response) {
                    if (response.status == 1) {
                        var total = $('#sub_total').val();
                        var tax = "<?php echo e(@$totalcarttax); ?>";
                        var delivery_charge = $('#shipping_charge').val();
                        var discount = 0;
                        var grandtotal = parseFloat(total) + parseFloat(tax) + parseFloat(delivery_charge) -
                            parseFloat(discount);
                        $('#offer_amount').text('-' + currency_format(parseFloat(0)));
                        $('#total_amount').text(currency_format(parseFloat(grandtotal)));
                        $('#offer_code').val('');
                        $('#grand_total').val(grandtotal);
                        $('#discount').val(discount);
                        $('#discount_section_display').addClass('d-none');
                        $('#btnremove').addClass('d-none');
                        $('#btnapply').removeClass('d-none');
                    } else {
                        toastr.error(response.message);
                    }
                }
            });
        }

        <?php if(helper::appdata()->ordertype_date_time == 1): ?>
            var dateFormat = "<?php echo e(helper::appdata()->date_format); ?>";
            var placeholderFormat = dateFormat
                .replace(/Y/g, 'yyyy') // Full year
                .replace(/m/g, 'mm') // Month
                .replace(/d/g, 'dd'); // Day

            document.getElementById("delivery_dt").setAttribute("placeholder", placeholderFormat);

            flatpickr(".delivery_pickup_date", {
                dateFormat: dateFormat,
                enableTime: false,
                altInput: true,
                altFormat: dateFormat,
                minDate: 'today'
            });
        <?php endif; ?>
    </script>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'web-assets/js/custom/checkout.js')); ?>"></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/checkout/checkout.blade.php ENDPATH**/ ?>