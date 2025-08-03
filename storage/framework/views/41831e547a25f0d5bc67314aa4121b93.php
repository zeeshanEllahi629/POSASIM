<table class="table table-striped table-bordered zero-configuration">
    <thead>
        <tr>
            <th>#</th>
            <th><?php echo e(trans('labels.order_number')); ?></th>
            <th><?php echo e(trans('labels.date')); ?></th>
            <th><?php echo e(trans('labels.user_info')); ?></th>
            <th><?php echo e(trans('labels.order_type')); ?></th>
            <th><?php echo e(trans('labels.payment_type')); ?></th>
            <th><?php echo e(trans('labels.grand_total')); ?></th>
            <th><?php echo e(trans('labels.status')); ?></th>
            <th><?php echo e(trans('labels.status_update')); ?></th>
            <th><?php echo e(trans('labels.action')); ?></th>
        </tr>
    </thead>
    <tbody>
        <?php $__currentLoopData = $getorders; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $orderdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr id="dataid<?php echo e($orderdata->id); ?>">
                <td><?php echo e(++$key); ?></td>
                <td>
                    <div class="d-flex justify-content-between">
                        <a href="<?php echo e(URL::to('admin/invoice/' . $orderdata->id)); ?>"
                            class="text-dark"><?php echo e($orderdata->order_number); ?></a>
                        <?php if($orderdata->admin_notes != null): ?>
                            <a href="javascript:void(0)" class="btn btn-primary btn-sm hov square"
                                tooltip="<?php echo e($orderdata->admin_notes); ?>">
                                <i class="fa-solid fa-clipboard"></i>
                            </a>
                        <?php endif; ?>
                    </div>
                </td>
                <td><?php echo e(helper::date_format($orderdata->created_at)); ?></td>
                <td>
                    <?php echo e(@$orderdata->name); ?>

                </td>
                <td>
                    <?php if($orderdata->order_type == 1): ?>
                        <?php echo e(trans('labels.delivery')); ?>

                    <?php elseif($orderdata->order_type == 2): ?>
                        <?php echo e(trans('labels.pickup')); ?>

                    <?php elseif($orderdata->order_type == 3): ?>
                        <?php echo e(trans('labels.pos')); ?>

                    <?php endif; ?>
                </td>
                <td>
                    <?php if($orderdata->order_type == 3): ?>
                        <?php if($orderdata->transaction_type == 0): ?>
                            <?php echo e(trans('labels.online')); ?>

                        <?php elseif($orderdata->transaction_type == 1): ?>
                            <?php echo e(trans('labels.cash')); ?>

                        <?php endif; ?>
                    <?php else: ?>
                        <?php echo e(helper::getpayment($orderdata->transaction_type)); ?>

                    <?php endif; ?>
                    <br>
                    <?php if($orderdata->payment_status == 1): ?>
                        <small class="text-danger"> <i class="fa-regular fa-clock"></i>
                            <?php echo e(trans('labels.unpaid')); ?></small>
                    <?php else: ?>
                        <small class="text-success"> <i class="fa-regular fa-check"></i>
                            <?php echo e(trans('labels.paid')); ?></small>
                    <?php endif; ?>
                </td>
                <td><?php echo e(helper::currency_format($orderdata->grand_total)); ?></td>

                <td>
                    <?php if($orderdata->status_type == 1): ?>
                        <small
                            class="text-order-placed"><?php echo e(helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name); ?></small>
                    <?php elseif($orderdata->status_type == 2): ?>
                        <small
                            class="text-order-waitingpickup"><?php echo e(helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name); ?></small>
                    <?php elseif($orderdata->status_type == 3): ?>
                        <small
                            class="text-order-completed"><?php echo e(helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name); ?></small>
                    <?php elseif($orderdata->status_type == 4): ?>
                        <small
                            class="text-order-cancelled"><?php echo e(helper::gettype($orderdata->status, $orderdata->status_type, $orderdata->order_type)->name); ?></small>
                    <?php endif; ?>
                </td>
                <td>
                    <?php if($orderdata->status_type == 1 || $orderdata->status_type == 2): ?>
                        <button type="button" class="btn btn-primary btn-sm dropdown-toggle px-4 py-2"
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
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <a class="btn btn-sm btn-secondary square" target="_blank" tooltip="View" title="<?php echo e(trans('labels.view')); ?>"
                            href="<?php echo e(URL::to('admin/invoice/' . $orderdata->id)); ?>"><i
                                class="fa-regular fa-eye"></i></a>
                        <a class="btn btn-sm btn-primary square" target="_blank" tooltip="Print" title="<?php echo e(trans('labels.print')); ?>"
                            href="<?php echo e(URL::to('admin/print/' . $orderdata->id)); ?>"><i
                                class="fa-regular fa-print"></i></a>
                        <a href="<?php echo e(URL::to('admin/generatepdf/' . $orderdata->id)); ?>" class="btn btn-warning square"
                            tooltip="Download PDF">
                            <i class="fa-solid fa-file-pdf" aria-hidden="true"></i>
                        </a>
                        <?php if(
                            ($orderdata->transaction_type == 1 || $orderdata->transaction_type == 16) &&
                                $orderdata->payment_status == 1 &&
                                $orderdata->status_type == 3): ?>
                            <a class="btn btn-sm btn-info square" tooltip="Payment Status"
                                onclick="codpayment('<?php echo e($orderdata->order_number); ?>','<?php echo e($orderdata->grand_total); ?>','<?php echo e($orderdata->transaction_type); ?>','<?php echo e(helper::image_path($orderdata->screenshot)); ?>')">
                                <i class="fa-solid fa-file-invoice-dollar"></i>
                            </a>
                        <?php endif; ?>
                    </div>
                </td>
            </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/orders/orderstable.blade.php ENDPATH**/ ?>