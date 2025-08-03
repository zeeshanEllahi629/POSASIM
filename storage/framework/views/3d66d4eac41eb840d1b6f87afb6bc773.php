<table class="table table-striped table-bordered zero-configuration">
    <thead>
        <tr>
            <th>#</th>
            <th><?php echo e(trans('labels.image')); ?></th>
            <th><?php echo e(trans('labels.title')); ?></th>
            <th><?php echo e(trans('labels.description')); ?></th>
            <th><?php echo e(trans('labels.action')); ?></th>
        </tr>
    </thead>
    <tbody>
        <?php $i = 1; ?>
        <?php $__currentLoopData = $gettutorials; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $tutorial): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr id="dataid<?php echo e($tutorial->id); ?>">
                <td><?php echo $i++; ?></td>
                <td><img src='<?php echo e(helper::image_path($tutorial->image)); ?>' class='img-fluid rounded h-50px'></td>
                <td><?php echo e($tutorial->title); ?></td>
                <td><?php echo e($tutorial->description); ?></td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <a class="btn btn-sm btn-info square" tooltip="<?php echo e(trans('labels.edit')); ?>"
                            href="<?php echo e(URL::to('admin/tutorial-' . $tutorial->id)); ?>">
                            <i class="fa-solid fa-pen-to-square"></i></a>
                        <a class="btn btn-sm btn-danger square" tooltip="<?php echo e(trans('labels.delete')); ?>"
                            <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="Delete('<?php echo e($tutorial->id); ?>','<?php echo e(URL::to('admin/tutorial/delete')); ?>')" <?php endif; ?>>
                            <i class="fa fa-trash"></i></a>
                    </div>
                </td>
            </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/tutorial/table.blade.php ENDPATH**/ ?>