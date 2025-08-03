<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-12 my-2 d-flex justify-content-end">
                
                <?php if($orderdata->status_type == 1 || $orderdata->status_type == 2): ?>
                    <button type="button" class="btn btn-dark dropdown-toggle px-4 py-2"
                        data-bs-toggle="dropdown"><?php echo e(@helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name == null ? trans('labels.action') : @helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name); ?></button>
                    <div class="dropdown-menu dropdown-menu-right branch-only cursor-pointer">
                        <?php $__currentLoopData = helper::customstauts($orderdata->order_type); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $status): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <a class="dropdown-item w-auto <?php if($orderdata->status == $status->id): ?> fw-600 <?php endif; ?>"
                                onclick="OrderStatusUpdate('<?php echo e($orderdata->id); ?>','<?php echo e($status->id); ?>','<?php echo e($status->type); ?>','<?php echo e(URL::to('admin/orders/update')); ?>')">
                                <?php echo e($status->name); ?>

                            </a>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="row justify-content-between g-md-4 g-lg-4">
                    <div class="col-xl-3 col-md-6">

                        <div class="card border-0 mb-3 h-100 d-flex shadow">
                            <div
                                class="card-header d-flex align-items-center bg-transparent text-dark py-3 justify-content-between">
                                <h6 class="px-2 fw-500"><i class="fa-solid fa-clipboard fs-5"></i>
                                    <?php echo e(trans('labels.your_order_details')); ?></h6>
                            </div>
                            <div class="card-body">
                                <div class="basic-list-group">
                                    <ul class="list-group list-group-flush">
                                        <li
                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                            <p><?php echo e(trans('labels.order_number')); ?></p>
                                            <p class="text-dark fw-600"><?php echo e($orderdata->order_number); ?></p>
                                        </li>
                                        <li
                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                            <?php echo e(trans('labels.order_date')); ?>

                                            <p class="text-muted">
                                                <?php echo e(helper::date_format($orderdata->created_at)); ?></p>
                                        </li>
                                        <?php if($orderdata->delivery_date != ''): ?>
                                            <li
                                                class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                <?php echo e($orderdata->order_type == '1' ? trans('labels.delivery_date') : trans('labels.pickup_date')); ?>

                                                <p class="text-muted">
                                                    <?php echo e(helper::date_format($orderdata->delivery_date)); ?></p>
                                            </li>
                                        <?php endif; ?>
                                        <?php if($orderdata->delivery_time != ''): ?>
                                            <li
                                                class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                <?php echo e($orderdata->order_type == '1' ? trans('labels.delivery_time') : trans('labels.pickup_time')); ?>

                                                <p class="text-muted">
                                                    <?php echo e($orderdata->delivery_time); ?></p>
                                            </li>
                                        <?php endif; ?>
                                        <?php if(@helper::checkaddons('vendor_tip')): ?>
                                            <?php if(@helper::otherappdata()->tips_settings == 1): ?>
                                                <li
                                                    class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                    <?php echo e(trans('labels.tips_pro')); ?>

                                                    <p class="text-muted">
                                                        <?php echo e(helper::currency_format($orderdata->tips)); ?>

                                                    </p>
                                                </li>
                                            <?php endif; ?>
                                        <?php endif; ?>
                                        <li
                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                            <?php echo e(trans('labels.payment_type')); ?>

                                            <p class="text-muted">
                                                <?php if($orderdata->order_type == 3): ?>
                                                    <?php if($orderdata->transaction_type == 0): ?>
                                                        <?php echo e(trans('labels.online')); ?>

                                                    <?php elseif($orderdata->transaction_type == 1): ?>
                                                        <?php echo e(trans('labels.cash')); ?>

                                                    <?php endif; ?>
                                                <?php elseif($orderdata->transaction_type == 16): ?>
                                                    <?php echo e(@helper::getpayment($orderdata->transaction_type)); ?>

                                                    : <small><a href="<?php echo e(helper::image_path($orderdata->screenshot)); ?>"
                                                            target="_blank"
                                                            class="text-danger"><?php echo e(trans('labels.click_here')); ?></a></small>
                                                <?php else: ?>
                                                    <?php echo e(helper::getpayment($orderdata->transaction_type)); ?>

                                                <?php endif; ?>
                                            </p>
                                        </li>
                                        <li
                                                class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                            <?php echo e(trans('labels.payment_status')); ?>

                                            <p class="text-muted">
                                                <?php if($orderdata->payment_status == 1): ?>
                                                    <strong class="text-danger"> <i class="fa-regular fa-clock"></i>
                                                        <?php echo e(trans('labels.unpaid')); ?></strong>
                                                <?php else: ?>
                                                    <strong class="text-success"> <i class="fa-regular fa-check"></i>
                                                        <?php echo e(trans('labels.paid')); ?></strong>
                                            <?php endif; ?>
                                        </li>

                                        <?php if(in_array($orderdata->transaction_type, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])): ?>
                                            <li
                                                class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                <?php echo e(trans('labels.transaction_id')); ?>

                                                <p class="text-muted">
                                                    <?php echo e($orderdata->transaction_id); ?>

                                                </p>
                                            </li>
                                        <?php endif; ?>
                                        <?php if($orderdata->order_notes != ''): ?>
                                            <li class="list-group-item px-0"><?php echo e(trans('labels.order_note')); ?>

                                                <p class="text-muted">
                                                    <?php echo e($orderdata->order_notes); ?>

                                                </p>
                                            </li>
                                        <?php endif; ?>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="card border-0 mb-3 h-100 d-flex shadow">
                            <div
                                class="card-header d-flex align-items-center bg-transparent text-dark py-3 justify-content-between">
                                <h6 class="px-2 fw-500"><i class="fa-solid fa-user fs-5"></i>
                                    <?php echo e(trans('labels.customer_info')); ?>

                                </h6>
                                <p class="text-muted cursor-pointer"
                                    onclick="editcustomerdata('<?php echo e($orderdata->order_number); ?>','<?php echo e($orderdata->name); ?>','<?php echo e($orderdata->mobile); ?>','<?php echo e($orderdata->email); ?>','<?php echo e($orderdata->address); ?>','<?php echo e($orderdata->city); ?>','<?php echo e($orderdata->state); ?>','<?php echo e($orderdata->country); ?>','<?php echo e($orderdata->landmark); ?>','<?php echo e($orderdata->postal_code); ?>','customer_info')">
                                    <i class="fa-solid fa-pen-to-square"></i>
                                </p>
                            </div>
                            <div class="card-body">
                                <div class="basic-list-group">
                                    <div class="row">
                                        <div class="basic-list-group">
                                            <ul class="list-group list-group-flush">
                                                <li
                                                    class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                    <p><?php echo e(trans('labels.name')); ?></p>
                                                    <p class="text-muted">
                                                        <?php echo e($orderdata->name); ?>

                                                    </p>
                                                </li>
                                                <li
                                                    class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                    <p><?php echo e(trans('labels.mobile')); ?></p>
                                                    <p class="text-muted">
                                                        <?php echo e($orderdata->mobile); ?>

                                                    </p>
                                                </li>
                                                <li
                                                    class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                    <p><?php echo e(trans('labels.email')); ?></p>
                                                    <p class="text-muted">
                                                        <?php echo e($orderdata->email); ?>

                                                    </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="card border-0 mb-3 h-100 d-flex shadow">
                            <div
                                class="card-header d-flex align-items-center bg-transparent text-dark py-3 justify-content-between">
                                <h6 class="px-2 fw-500"><i class="fa-solid fa-file-invoice fs-5"></i>
                                    <?php echo e($orderdata->order_type == '2' ? trans('labels.info') : trans('labels.bill_to')); ?>

                                </h6>
                                <?php if($orderdata->order_from != 'pos' && $orderdata->order_type == '1'): ?>
                                    <p class="text-muted cursor-pointer"
                                        onclick="editcustomerdata('<?php echo e($orderdata->order_number); ?>','<?php echo e($orderdata->name); ?>','<?php echo e($orderdata->mobile); ?>','<?php echo e($orderdata->email); ?>','<?php echo e($orderdata->address); ?>','<?php echo e($orderdata->city); ?>','<?php echo e($orderdata->state); ?>','<?php echo e($orderdata->country); ?>','<?php echo e($orderdata->landmark); ?>','<?php echo e($orderdata->postal_code); ?>','bill_info')">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </p>
                                <?php endif; ?>
                            </div>
                            <div class="card-body">
                                <div class="basic-list-group">
                                    <div class="row">
                                        <div class="col-md-12 mb-2">
                                            <div class="basic-list-group">
                                                <ul class="list-group list-group-flush">
                                                    <?php if($orderdata->order_from == 'pos'): ?>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.pos')); ?></p>
                                                        </li>
                                                    <?php elseif($orderdata->order_from == 'web' && $orderdata->order_type == '2'): ?>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.take_away')); ?></p>
                                                        </li>
                                                    <?php else: ?>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.address')); ?></p>
                                                            <p class="text-muted"><?php echo e($orderdata->address); ?></p>
                                                        </li>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.city')); ?></p>
                                                            <p class="text-muted"> <?php echo e($orderdata->city); ?></p>
                                                        </li>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.state')); ?></p>
                                                            <p class="text-muted"> <?php echo e($orderdata->state); ?></p>
                                                        </li>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.country')); ?></p>
                                                            <p class="text-muted"> <?php echo e($orderdata->country); ?></p>
                                                        </li>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.landmark')); ?></p>
                                                            <p class="text-muted"> <?php echo e($orderdata->landmark); ?></p>
                                                        </li>
                                                        <li
                                                            class="list-group-item px-0 fs-7 fw-400 d-flex justify-content-between align-items-center">
                                                            <p><?php echo e(trans('labels.pincode')); ?></p>
                                                            <p class="text-muted"> <?php echo e($orderdata->postal_code); ?></p>
                                                        </li>
                                                    <?php endif; ?>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-xl-3 col-md-6">
                        <div class="card border-0 mb-3 h-100 d-flex shadow">
                            <div
                                class="card-header d-flex align-items-center bg-transparent text-dark py-3 justify-content-between">
                                <h6 class="px-2 fw-500"><i class="fa-solid fa-clipboard fs-5"></i>
                                    <?php echo e(trans('labels.notes')); ?></h6>
                            </div>
                            <div class="card-body">
                                <div class="basic-list-group">
                                    <div class="row">
                                        <div class="basic-list-group">
                                            <?php if($orderdata->admin_notes != ''): ?>
                                                <div class="alert alert-info" role="alert">
                                                    <?php echo e($orderdata->admin_notes); ?>

                                                </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer bg-white">
                                <form action="<?php echo e(URL::to('admin/orders/order_note')); ?>" method="POST">
                                    <?php echo csrf_field(); ?>
                                    <div class="form-group col-md-12">
                                        <label for="note"> <?php echo e(trans('labels.note')); ?> </label>
                                        <div class="controls">
                                            <input type="hidden" name="order_id" class="form-control"
                                                value="<?php echo e($orderdata->order_number); ?>">
                                            <input type="text" name="admin_notes" class="form-control" required>
                                        </div>
                                    </div>
                                    <div
                                        class="form-group <?php echo e(session()->get('direction') == '2' ? 'text-start' : 'text-end'); ?>">
                                        <button
                                            <?php if(env('Environment') == 'sendbox'): ?> type="button" onclick="myFunction()" type="submit" <?php endif; ?>
                                            class="btn btn-primary"> <?php echo e(trans('labels.update')); ?> </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-12">
                <div class="card border-0 mt-4">
                    <div class="card-header d-flex align-items-center bg-transparent text-dark py-3">
                        <i class="fa-solid fa-bag-shopping fs-5"></i>
                        <h6 class="px-2 fw-500"><?php echo e(trans('labels.orders')); ?></h6>
                    </div>
                    <div class="card-body">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th><?php echo e(trans('labels.image')); ?></th>
                                        <th><?php echo e(trans('labels.item')); ?></th>
                                        <th class="text-end"><?php echo e(trans('labels.unit_cost')); ?></th>
                                        <th class="text-end"><?php echo e(trans('labels.qty')); ?></th>
                                        <th class="text-end"><?php echo e(trans('labels.total')); ?></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                        $data = [];
                                    ?>
                                    <?php $__currentLoopData = $ordersdetails; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $orders): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <?php
                                            $total_price =
                                                ($orders['item_price'] +
                                                    $orders['addons_total_price'] +
                                                    $orders['extras_total_price']) *
                                                $orders['qty'];
                                            $data[] = ['total_price' => $total_price];
                                            $order_total = array_sum(array_column(@$data, 'total_price'));
                                            $addonstotal = $orders->addons_total_price + $orders->extras_total_price;
                                        ?>
                                        <tr>
                                            <td><img src="<?php echo e(helper::image_path($orders->item_image)); ?>"
                                                    class="rounded h-50px" alt=""></td>
                                            <td>
                                                <img <?php if($orders['item_type'] == 1): ?> src="<?php echo e(helper::image_path('veg.svg')); ?>" <?php else: ?> src="<?php echo e(helper::image_path('nonveg.svg')); ?>" <?php endif; ?>
                                                    class="item-type-img" alt="">
                                                <?php echo e($orders->item_name); ?> <br>
                                                <?php if($orders['addons_id'] != '' || $orders['extras_id'] != ''): ?>
                                                    <small>
                                                        <a class="text-muted fw-500" href="javascript:void(0)"
                                                            onclick="showaddons('<?php echo e($orders['addons_name']); ?>','<?php echo e($orders['addons_price']); ?>','<?php echo e($orders['extras_name']); ?>','<?php echo e($orders['extras_price']); ?>','<?php echo e($orders['item_name']); ?>')"><?php echo e(trans('labels.customize')); ?>

                                                        </a>
                                                    </small>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-end">
                                                <?php echo e(helper::currency_format($orders->item_price)); ?>

                                                <?php if($addonstotal != 0): ?>
                                                    <br><small class="text-muted">+
                                                        <?php echo e(helper::currency_format($addonstotal)); ?></small>
                                                <?php endif; ?>
                                            </td>
                                            <td class="text-end"><?php echo e($orders->qty); ?></td>
                                            <td class="text-end">
                                                <?php echo e(helper::currency_format($total_price)); ?></td>
                                        </tr>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    <tr>
                                        <td class="text-end" colspan="4">
                                            <p class="fw-400"><?php echo e(trans('labels.subtotal')); ?></p>
                                        </td>
                                        <td class="text-end">
                                            <p class="fw-400"><?php echo e(helper::currency_format($order_total)); ?></p>
                                        </td>
                                    </tr>
                                    <?php if($orderdata->discount_amount > 0): ?>
                                        <tr>
                                            <td class="text-end" colspan="4">
                                                <p class="fw-400"><?php echo e(trans('labels.discount')); ?></p>
                                                <?php echo e($orderdata->offer_code != '' ? '(' . $orderdata->offer_code . ')' : ''); ?>

                                            </td>
                                            <td class="text-end">
                                                <p class="fw-400">-
                                                    <?php echo e(helper::currency_format($orderdata->discount_amount)); ?></p>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                    <?php
                                        $tax = explode('|', $orderdata->tax_amount);
                                        $tax_name = explode('|', $orderdata->tax_name);
                                    ?>
                                    <?php if($orderdata->tax_name != null && $orderdata->tax_amount > 0): ?>
                                        <?php $__currentLoopData = $tax; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $tax_value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <tr>
                                                <td class="text-end" colspan="4">
                                                    <p class="fw-400"><?php echo e($tax_name[$key]); ?></p>
                                                </td>
                                                <td class="text-end">
                                                    <p class="fw-400"><?php echo e(helper::currency_format($tax_value)); ?></p>
                                                </td>
                                            </tr>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    <?php endif; ?>
                                    <?php if($orderdata->order_type == 1): ?>
                                        <tr>
                                            <td class="text-end" colspan="4">
                                                <p class="fw-400"><?php echo e(trans('labels.delivery')); ?>

                                                    <?php if($orderdata->shipping_area != ''): ?>
                                                        (<?php echo e($orderdata->shipping_area); ?>)
                                                    <?php endif; ?>
                                                </p>
                                            </td>
                                            <td class="text-end">
                                                <p class="fw-400">
                                                    <?php if($orderdata->delivery_charge > 0): ?>
                                                        <?php echo e(helper::currency_format($orderdata->delivery_charge)); ?>

                                                    <?php else: ?>
                                                        <?php echo e(trans('labels.free')); ?>

                                                    <?php endif; ?>
                                                </p>
                                            </td>
                                        </tr>
                                    <?php endif; ?>
                                    <tr>
                                        <td class="text-end" colspan="4">
                                            <strong><?php echo e(trans('labels.grand_total')); ?></strong>
                                        </td>
                                        <td class="text-end">
                                            <strong><?php echo e(helper::currency_format($orderdata->grand_total)); ?></strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('script'); ?>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'admin-assets/assets/js/custom/orders.js')); ?>"></script>
    <script>
        function showaddons(addon_name, addon_price, extra_name, extra_price, item_name) {
            "use strict";
            $('#addons').addClass('d-none');
            $('#extras').addClass('d-none');
            $('#modal_selected_addons').find('#addon_item_name').html(item_name);
            var response1 = '';
            if (addon_name.split('| ') != '') {
                $.each(addon_name.split('| '), function(key, value) {
                    response1 += '<li class="list-group-item fs-7 d-flex justify-content-between text-black">' +
                        value +
                        ' <p class="mb-0">' + currency_format(addon_price.split('| ')[key]) + '</p> </li>';
                });
                $('#addons').removeClass('d-none');
            }
            $('#item-addons').html(response1);
            var response2 = '';
            if (extra_name.split('| ') != '') {
                $.each(extra_name.split('| '), function(key, value) {
                    response2 += '<li class="list-group-item fs-7 d-flex justify-content-between text-black"> ' +
                        value +
                        ' <p class="mb-0">' + currency_format(extra_price.split('| ')[key]) + '</p> </li>';
                });
                $('#extras').removeClass('d-none');
            }
            $('#item-extras').html(response2);
            $('#modal_selected_addons').modal('show');
        }

        function editcustomerdata(order_id, customer_name, customer_mobile, customer_email, bill_address, bill_city,
            bill_state, bill_country, bill_landmark, bill_pincode, type) {
            "use strict";
            $('#modal_order_id').val(order_id);
            if (type == "customer_info") {
                $('#user_name').val(customer_name);
                $('#user_mobile').val(customer_mobile);
                $('#user_email').val(customer_email);
                $('#edit_type').val(type);
                $('#bill_info').hide();
                $('#customer_info').show();
                $('#bill_address').removeAttr('required');
                $('#bill_city').removeAttr('required');
                $('#bill_state').removeAttr('required');
                $('#bill_country').removeAttr('required');
                $('#bill_landmark').removeAttr('required');
                $('#bill_pincode').removeAttr('required');
            } else {
                $('#bill_address').val(bill_address.replace(/[|]+/g, ","));
                $('#bill_city').val(bill_city);
                $('#bill_state').val(bill_state);
                $('#bill_country').val(bill_country);
                $('#bill_landmark').val(bill_landmark);
                $('#bill_pincode').val(bill_pincode);
                $('#edit_type').val(type);
                $('#bill_info').show();
                $('#customer_info').hide();
                $('#user_name').removeAttr('required');
                $('#user_email').removeAttr('required');
                $('#user_mobile').removeAttr('required');
            }
            $('#customerinfo').modal('show');

        }

        $('#driver').on('change', function() {
            $.ajax({
                headers: {
                    "X-CSRF-TOKEN": $('meta[name="csrf-token"]').attr("content")
                },
                url: "<?php echo e(URL::to('admin/orders/assign-driver')); ?>",
                type: "post",
                dataType: "json",
                data: {
                    driver_id: $(this).val(),
                    order_id: "<?php echo e($orderdata->id); ?>",
                },
                success: function(response) {
                    if (response.status == 0) {
                        toastr.error(response.message);
                    } else {
                        location.reload();
                    }
                }
            });
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/orders/invoice.blade.php ENDPATH**/ ?>