<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.add_money')); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
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
                            aria-current="page"><?php echo e(trans('labels.add_money')); ?></li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <section>
        <div class="container my-5">
            <div class="row">
                <div class="col-lg-3">
                    <?php echo $__env->make('web.layout.usersidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                </div>
                <div class="col-lg-9">
                    <div class="user-content-wrapper">
                        <div class="mb-3 border-bottom  pb-3">
                            <p class="title mb-0"><?php echo e(trans('labels.add_money')); ?></p>
                        </div>
                        <div class="row mb-3">
                            <div class="form-group">
                                <label for="" class="form-label"><?php echo e(trans('labels.amount')); ?>

                                    <span class="text-danger">*</span>
                                </label>
                                <div class="input-group gap-2">
                                    <span class="input-group-text rounded"><?php echo e(@helper::appdata()->currency); ?></span>
                                    <input type="text" class="form-control rounded" name="amount" id="amount"
                                        placeholder="<?php echo e(trans('messages.amount_required')); ?>">
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-between align-items-center">
                            <div class="col-xl-6 col-12">
                                <p class="mb-0"><?php echo e(trans('labels.notes')); ?> :</p>
                                <ul>
                                    <li class="text-muted">
                                        <i class="fa-regular fa-circle-check mx-2 text-success"></i>
                                        <?php echo e(trans('labels.wallet_add_note_1')); ?>

                                    </li>
                                    <li class="text-muted">
                                        <i class="fa-regular fa-circle-check mx-2 text-success"></i>
                                        <?php echo e(trans('labels.wallet_add_note_2')); ?>

                                    </li>
                                </ul>
                            </div>
                            <div class="col-xl-6 col-12">
                                <?php echo $__env->make('web.service-trusted', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        </div>
                        <div class="payment-option mb-3">
                            
                            <?php echo $__env->make('web.paymentmethodsview', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                        </div>
                        <div class="d-flex justify-content-center my-4">
                            <button
                                class="btn btn-primary px-4 py-2 d-flex gap-3 justify-content-center align-items-center add_money"
                                onclick="addmoney()">
                                <?php echo e(trans('labels.proceed_to_pay')); ?>

                                <div class="loader d-none add_money_loader"></div>
                            </button>
                        </div>
                       
                        <input type="hidden" name="walleturl" id="walleturl" value="<?php echo e(URL::to('/wallet/recharge')); ?>">
                        <input type="hidden" name="successurl" id="successurl" value="<?php echo e(URL::to('/wallet')); ?>">
                        <input type="hidden" name="user_name" id="user_name" value="<?php echo e(Auth::user()->name); ?>">
                        <input type="hidden" name="user_email" id="user_email" value="<?php echo e(Auth::user()->email); ?>">
                        <input type="hidden" name="user_mobile" id="user_mobile" value="<?php echo e(Auth::user()->mobile); ?>">

                        <input type="hidden" name="addsuccessurl" id="addsuccessurl"
                            value="<?php echo e(URL::to('/addwalletsuccess')); ?>">
                        <input type="hidden" name="addfailurl" id="addfailurl" value="<?php echo e(URL::to('/wallet')); ?>">

                        <input type="hidden" name="myfatoorahurl" id="myfatoorahurl" value="<?php echo e(URL::to('myfatoorah')); ?>">
                        <input type="hidden" name="mercadopagourl" id="mercadopagourl"
                            value="<?php echo e(URL::to('mercadorequest')); ?>">
                        <input type="hidden" name="paypalurl" id="paypalurl" value="<?php echo e(URL::to('paypal')); ?>">
                        <input type="hidden" name="toyyibpayurl" id="toyyibpayurl" value="<?php echo e(URL::to('toyyibpay')); ?>">
                        <input type="hidden" name="paytaburl" id="paytaburl" value="<?php echo e(URL::to('/paytab')); ?>">
                        <input type="hidden" name="phonepeurl" id="phonepeurl" value="<?php echo e(URL::to('/phonepe')); ?>">
                        <input type="hidden" name="mollieurl" id="mollieurl" value="<?php echo e(URL::to('/mollie')); ?>">
                        <input type="hidden" name="khaltiurl" id="khaltiurl" value="<?php echo e(URL::to('/khalti')); ?>">
                        <input type="hidden" name="xenditurl" id="xenditurl" value="<?php echo e(URL::to('/xendit')); ?>">

                        <input type="hidden" value="<?php echo e(trans('messages.payment_selection_required')); ?>"
                            name="payment_type_message" id="payment_type_message">

                        <input type="hidden" value="<?php echo e(trans('messages.amount_required')); ?>" name="amount_message"
                            id="amount_message">

                        <form action="<?php echo e(URL::to('paypal')); ?>" method="post" class="d-none">
                            <?php echo e(csrf_field()); ?>

                            <input type="hidden" name="return" value="2">
                            <input type="submit" class="callpaypal" name="submit">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <?php echo $__env->make('web.subscribeform', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('scripts'); ?>
    <script src="https://checkout.stripe.com/v2/checkout.js"></script>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script src="https://checkout.flutterwave.com/v3.js"></script>
    <script src="https://js.paystack.co/v1/inline.js"></script>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'web-assets/js/custom/wallet.js')); ?>"></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/wallet/addmoney.blade.php ENDPATH**/ ?>