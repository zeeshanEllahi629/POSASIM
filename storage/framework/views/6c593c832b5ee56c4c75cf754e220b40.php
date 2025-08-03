<?php if(count($getgalleries) > 0): ?>
    <div class="row g-3 row-cols-xl-5 row-cols-lg-3 row-cols-md-3 row-cols-sm-3 row-cols-2">
        <?php $__currentLoopData = $getgalleries; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $gallery): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <div class="col">
                <div class="card border-0 text-center">
                    <div class="card-body border-0">
                        <img src="<?php echo e(helper::image_path($gallery->image)); ?>" class="img-fluid gallery-img rounded"
                            alt="">
                        <div class="mt-2">
                            <div class="d-flex flex-wrap gap-1 justify-content-center">
                                <a class="btn btn-sm btn-info square" href="<?php echo e(URL::to('admin/gallery-' . $gallery->id)); ?>"><i
                                        class="fa-solid fa-pen-to-square"></i></a>
                                <a class="btn btn-sm btn-danger square" href="javascript:void(0)"
                                    <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="Delete('<?php echo e($gallery->id); ?>','<?php echo e(URL::to('admin/gallery/delete')); ?>')" <?php endif; ?>><i
                                        class="fa fa-trash"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </div>
<?php else: ?>
    <?php echo $__env->make('admin.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php endif; ?>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/gallery/card-view.blade.php ENDPATH**/ ?>