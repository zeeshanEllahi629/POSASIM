<table class="table table-striped table-bordered zero-configuration">
    <thead>
        <tr>
            <th>#</th>
            <th><?php echo e(trans('labels.item_name')); ?></th>
            <th><?php echo e(trans('labels.rating')); ?></th>
            <th><?php echo e(trans('labels.review')); ?></th>
            <th><?php echo e(trans('labels.status')); ?></th>
            <th><?php echo e(trans('labels.created_date')); ?></th>
            <th><?php echo e(trans('labels.updated_date')); ?></th>
            <th><?php echo e(trans('labels.action')); ?></th>
        </tr>
    </thead>
    <tbody>
        <?php $i = 1; ?>
        <?php $__currentLoopData = $getreview; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $reviews): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td><?php echo $i++; ?></td>
                <td><?php echo e(@$reviews->item_info->item_name); ?></td>
                <td><i class="fa fa-star text-warning"></i> <?php echo e(number_format($reviews->ratting, 1)); ?> </td>
                <td><small><?php echo e($reviews->comment); ?></small></td>
                <td>
                    <?php if($reviews->status == 1): ?>
                        <a class="btn btn-sm btn-success square" tooltip="Avtive"
                            <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()"
                    <?php else: ?> onclick="StatusUpdate('<?php echo e($reviews->id); ?>','2','<?php echo e(URL::to('admin/reviews/status')); ?>')" <?php endif; ?>>
                            <i class="fa-sharp fa-solid fa-check"></i></a>
                    <?php else: ?>
                        <a class="btn btn-sm btn-danger square" tooltip="Deavtive"
                            <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()"
                    <?php else: ?> onclick="StatusUpdate('<?php echo e($reviews->id); ?>','1','<?php echo e(URL::to('admin/reviews/status')); ?>')" <?php endif; ?>>
                            <i class="fa-sharp fa-solid fa-xmark"></i></a>
                    <?php endif; ?>
                </td>
                <td>
                    <?php echo e(helper::date_format($reviews->created_at)); ?> <br>
                    <?php echo e(helper::time_format($reviews->created_at)); ?>

                </td>
                <td>
                    <?php echo e(helper::date_format($reviews->updated_at)); ?> <br>
                    <?php echo e(helper::time_format($reviews->updated_at)); ?>

                </td>
                <td>
                    <a class="btn btn-sm btn-danger square" tooltip="Delete"
                        <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="DeleteData('<?php echo e($reviews->id); ?>','<?php echo e(URL::to('admin/reviews/destroy')); ?>')" <?php endif; ?>><i
                            class="fa fa-trash"></i></a>
                </td>
            </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/reviews/table.blade.php ENDPATH**/ ?>