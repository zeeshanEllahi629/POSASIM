<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.menu')); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
    <style>
        body {
            overflow-x: hidden;
            background: none !important; /* clear default */
        }

        /*.fixed-sidebar {*/
        /*    position: fixed;*/
        /*    top: 106px; !* adjust based on your header *!*/
        /*    height: calc(100vh - 80px);*/
        /*    overflow-y: auto;*/
        /*}*/


        .left-sidebar {
            left: 8px;
            /*width: 25%; !* col-md-2 *!*/
        }
        .right-sidebar {
            right: 8px;
            /*width: 33%; !* col-md-3 *!*/
        }
        .main-content {
            margin-left: 16.6667%;
            margin-right: 25%;
            padding-top: 20px;
        }
    </style>
    <div class="menu-background">
        <div class="container-fluid py-4">
            <div class="row">

                <!-- Left: Categories -->
                <div class="col-md-3 mb-4">
                    <div class="fixed-sidebar left-sidebar">
                        <div class="card shadow-sm me-2">
                            <div class="card-header bg-white fw-bold">
                                Categories
                            </div>
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <div class="input-group">
                                            <input type="text" autocomplete="off" id="search" onkeyup="searchProduct(this)" class="form-control" placeholder="Search Menu">
                                            <span class="input-group-text bg-white">
                                                <i class="fas fa-search text-muted"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <?php $__currentLoopData = helper::get_categories(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $category): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col-6 mb-3" onclick="productByCategory('<?php echo e($category->id); ?>')">
                                            <div class="card border-0 shadow-sm h-100" style="cursor: pointer;" >
                                                <img src="<?php echo e(helper::image_path($category->image)); ?>" class="card-img-top" alt="<?php echo e($category->category_name); ?>" style="height: 100px; object-fit: cover;">
                                                <div class="card-body p-2 text-center bg-primary text-white fw-bold rounded-bottom">
                                                    <?php echo e(strtoupper($category->category_name)); ?>

                                                </div>
                                            </div>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Middle: Products -->
                <div class="col-md-5 mb-4 product--list">
                    <?php echo $__env->make('web.product_menu', [$getitemlist], \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                </div>
                <!-- Right: Cart -->
                <div class="col-md-4 mb-4 mr-2">
                    <div class="fixed-sidebar right-sidebar">
                        <div class="card mb-3 order-option">
                            <div class="card-body">
                                <div class="">
                                    <div class="heading mb-2 border-bottom">
                                        <h5><?php echo e(trans('labels.order_type')); ?></h5>
                                    </div>
                                    <div class="col-12 d-flex gap-3">
                                    <?php if($getsettings->pickup_delivery == 1): ?>
                                        <!-- Hidden radio inputs for form submission -->
                                            <input type="radio" name="order_type" value="1" id="delivery" class="d-none" <?php echo e(session()->get('order_type') == 1 ? 'checked' : ''); ?>>
                                            <input type="radio" name="order_type" value="2" id="pickup" class="d-none" <?php echo e(session()->get('order_type') == 2 ? 'checked' : ''); ?>>

                                            <!-- Visible toggle buttons -->
                                            <button type="button" class="btn <?php echo e(session()->get('order_type') == 1 ? 'btn-primary' : 'btn-outline-primary'); ?>" onclick="selectOrderType('1')">
                                                <?php echo e(trans('labels.delivery')); ?>

                                            </button>
                                            <button type="button" class="btn <?php echo e(session()->get('order_type') == 2 ? 'btn-primary' : 'btn-outline-primary'); ?>" onclick="selectOrderType('2')">
                                                <?php echo e(trans('labels.take_away')); ?>

                                            </button>

                                        <?php elseif($getsettings->pickup_delivery == 2): ?>
                                            <input type="radio" name="order_type" value="1" id="delivery" class="d-none" checked>
                                            <button type="button" class="btn btn-primary">
                                                <?php echo e(trans('labels.delivery')); ?>

                                            </button>

                                        <?php elseif($getsettings->pickup_delivery == 3): ?>
                                            <input type="radio" name="order_type" value="2" id="pickup" class="d-none" checked>
                                            <button type="button" class="btn btn-primary">
                                                <?php echo e(trans('labels.take_away')); ?>

                                            </button>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow-sm ms-2">
                            <div class="card-header bg-white fw-bold">
                                Your Cart
                            </div>
                            <?php if(count($getcartlist) == 0): ?>
                            <div class="card-body text-center">
                                <img src="<?php echo e(url(env('ASSETSPATHURL') . 'web-assets/images/empty-cart.png')); ?>" alt="Empty Cart" class="img-fluid mb-3" style="max-width: 120px;">
                                <h5 class="fw-semibold">Your cart is empty</h5>
                                <p class="text-muted small">Looks like you haven’t added anything yet.</p>

                            </div>
                            <?php else: ?>
                            <div class="card-body">
                                <!-- Cart Item -->
                                <?php
                                    $order_total = 0;
                                    $total_item_qty = 0;
                                ?>
                                <?php $__currentLoopData = $getcartlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $cartitems): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <?php
                                        $total_price =
                                            ($cartitems->item_price +
                                                $cartitems->addons_total_price +
                                                $cartitems->extras_total_price) *
                                            $cartitems->qty;
                                        $order_total += (float) $total_price;
                                        $total_item_qty += $cartitems->qty;
                                    ?>
                                <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                    <div>
                                        <div class="fw-semibold"><?php echo e($cartitems->item_name); ?>

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

                                        <div class="text-muted small"><?php echo e($cartitems->qty); ?> × <?php echo e(helper::currency_format($cartitems->item_price + $cartitems->addons_total_price + $cartitems->extras_total_price)); ?></div>
                                    </div>
                                    <div class="fw-bold"><?php echo e(helper::currency_format($total_price)); ?></div>
                                </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                <textarea class="form-control" onkeyup="saveNote(this)" id="order_note" rows="3"
                                          placeholder="<?php echo e(trans('labels.leave_comments')); ?>"></textarea>

                                <!-- More cart items... -->
                                <div class="border-top pt-3 mt-3">
                                    <div class="d-flex justify-content-between fw-bold mb-3">
                                        <span>Total:</span>
                                        <span><?php echo e(helper::currency_format($order_total)); ?></span>
                                    </div>
                                    <small><strong>Note:</strong> Shipping, taxes, and discounts codes calculated at checkout. (if applicable)</small>
                                    <a href="javascript:void(0)" onclick="isOrderType(this)" class="btn btn-secondary w-100 mt-3">View Cart</a>
                                    <button type="button" onclick="isCheckoutOrderType('<?php echo e(URL::to('/isopenclose')); ?>','<?php echo e($total_item_qty); ?>','<?php echo e($order_total); ?>')" class="btn btn-primary w-100 mt-3">Checkout</button>
                                </div>
                            </div>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

<?php $__env->stopSection(); ?>

<?php $__env->startSection('scripts'); ?>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'web-assets/js/custom/cart.js')); ?>"></script>
    <script>
        let myIsOrder = "<?php echo e(session()->has('order_type')); ?>" ? true: false;
        function isOrderType(input) {
            if (!myIsOrder){
                $('#orderModal').modal('toggle');
                return;
            }
            window.location.replace('/cart');
        }

        function isCheckoutOrderType(route, itemQuantity, orderTotal){
            if (!myIsOrder){
                $('#orderModal').modal('toggle');
                return;
            }
            isopenclose(route, itemQuantity, orderTotal)
        }

        $(function () {
            $('.cart-modal').hide();
        });

        function searchProduct(input){
            let val = $(input).val().trim();
            if(val.length > 0){
                $.get(`/search-products/${val}`, function(res){
                    $('.product--list').empty().append(res);
                });
            }
            if(val.length == 0){
                $.get(`/search-products`, function(res){
                    $('.product--list').empty().append(res);
                });
            }
        }

        function productByCategory(categoryId){
            $.get(`/category-products/${categoryId}`, function(res){
                $('.product--list').empty().append(res);
            });
        }

        function saveNote(input){
            let value = $(input).val();
            localStorage.setItem('special_instructions', value);
        }

        function saveMyOrderType(val){
            myOrderType = val;
            saveLocation()
        }

        function selectOrderType(type) {
            // Update hidden radio
            document.getElementById('delivery').checked = (type === '1');
            document.getElementById('pickup').checked = (type === '2');

            // Save in session or perform AJAX if needed
            if(type == '1'){
                $('#orderModal').modal('show');
            }else{
                saveMyOrderType(type);
            }

            // Update button styles
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                if (btn.innerText.trim() === (type === '1' ? '<?php echo e(trans("labels.delivery")); ?>' : '<?php echo e(trans("labels.take_away")); ?>')) {
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                } else if (btn.innerText.trim() === '<?php echo e(trans("labels.delivery")); ?>' || btn.innerText.trim() === '<?php echo e(trans("labels.take_away")); ?>') {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-primary');
                }
            });
        }

    </script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/menus.blade.php ENDPATH**/ ?>