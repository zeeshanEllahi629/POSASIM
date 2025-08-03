
<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card border-0">
                    <div class="card-body">
                        <div class="table-responsive" id="table-display">
                            <table class="table table-striped table-bordered zero-configuration">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th><?php echo e(trans('labels.email')); ?></th>
                                        <th><?php echo e(trans('labels.created_date')); ?></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php $i=1; ?>
                                    <?php $__currentLoopData = $list; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <tr>
                                            <td><?php echo $i++; ?></td>
                                            <td><?php echo e($value->email); ?></td>
                                            <td>
                                                <?php echo e(helper::date_format($value->created_at)); ?> <br>
                                                <?php echo e(helper::time_format($value->created_at)); ?>

                                            </td>
                                        </tr>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/subscribe/subscribe.blade.php ENDPATH**/ ?>