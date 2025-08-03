<table class="table table-striped table-bordered zero-configuration">
    <thead>
        <tr>
            <th></th>
            <th>#</th>
            <th><?php echo e(trans('labels.name')); ?></th>
            <th><?php echo e(trans('labels.designation')); ?></th>
            <th><?php echo e(trans('labels.social_links')); ?></th>
            <th><?php echo e(trans('labels.action')); ?></th>
        </tr>
    </thead>
    <tbody id="tabledetails" data-url="<?php echo e(url('admin/our-team/reorder_our_team')); ?>">
        <?php $i = 1; ?>
        <?php $__currentLoopData = $getteams; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $team): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr class="row1" data-id="<?php echo e($team->id); ?>">
                <td><a tooltip="<?php echo e(trans('labels.move')); ?>"><i class="fa-light fa-up-down-left-right mx-2"></i></a></td>
                <td><?php echo $i++; ?></td>
                <td><?php echo e($team->name); ?></td>
                <td><?php echo e($team->designation); ?></td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <?php if($team->fb != ''): ?>
                            <a class="btn btn-sm btn-primary square" tooltip="<?php echo e(trans('labels.facebook')); ?>"
                                href="<?php echo e($team->fb); ?>" target="_blank">
                                <i class="fab fa-facebook-square"></i> </a>
                        <?php endif; ?>
                        <?php if($team->youtube != ''): ?>
                            <a class="btn btn-sm btn-primary square" tooltip="<?php echo e(trans('labels.youtube')); ?>"
                                href="<?php echo e($team->youtube); ?>" target="_blank">
                                <i class="fab fa-youtube"></i> </a>
                        <?php endif; ?>
                        <?php if($team->insta != ''): ?>
                            <a class="btn btn-sm btn-primary square" tooltip="<?php echo e(trans('labels.instagram')); ?>"
                                href="<?php echo e($team->insta); ?>" target="_blank">
                                <i class="fab fa-instagram-square"></i> </a>
                        <?php endif; ?>
                        <?php if($team->twitter != ''): ?>
                            <a class="btn btn-sm btn-primary square" tooltip="<?php echo e(trans('labels.twitter')); ?>"
                                href="<?php echo e($team->twitter); ?>" target="_blank">
                                <i class="fab fa-twitter-square"></i> </a>
                        <?php endif; ?>
                    </div>
                </td>
                <td>
                    <div class="d-flex flex-wrap gap-1">
                        <a class="btn btn-sm btn-info square" tooltip="<?php echo e(trans('labels.edit')); ?>"
                            href="<?php echo e(URL::to('admin/our-team-' . $team->id)); ?>">
                            <i class="fa-solid fa-pen-to-square"></i></a>
                        <a class="btn btn-sm btn-danger square" tooltip="<?php echo e(trans('labels.delete')); ?>"
                            <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="Delete('<?php echo e($team->id); ?>','<?php echo e(URL::to('admin/our-team/delete')); ?>')" <?php endif; ?>>
                            <i class="fa fa-trash"></i></a>
                    </div>
                </td>
            </tr>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </tbody>
</table>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/team/table.blade.php ENDPATH**/ ?>