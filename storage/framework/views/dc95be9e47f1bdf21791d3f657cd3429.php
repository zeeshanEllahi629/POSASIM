
<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="row">
        <div class="col-12">
            <div class="card border-0 box-shadow">
                <div class="card-body">
                    <form action="<?php echo e(URL::to('admin/global_extras/store')); ?>" method="POST">
                        <?php echo csrf_field(); ?>
                        <div class="row">
                            <div class="form-group col-md-6">
                                <label class="form-label"><?php echo e(trans('labels.name')); ?><span class="text-danger"> *
                                    </span></label>
                                <input type="text" class="form-control" name="name" value="<?php echo e(old('name')); ?>"
                                    placeholder="<?php echo e(trans('labels.name')); ?>" required>
                            </div>
                            <div class="form-group col-md-6">
                                <label class="form-label"><?php echo e(trans('labels.price')); ?> <span class="text-danger"> *
                                    </span></label>
                                <input type="text" class="form-control numbers_only" name="price"
                                    value="<?php echo e(old('price')); ?>" placeholder="<?php echo e(trans('labels.price')); ?>" id="price"
                                    required>
                            </div>
                            <div class="form-group <?php echo e(session()->get('direction') == '2' ? 'text-start' : 'text-end'); ?>">
                                <a href="<?php echo e(URL::to('admin/global_extras')); ?>"
                                    class="btn btn-danger"><?php echo e(trans('labels.cancel')); ?></a>
                                <button
                                    class="btn btn-primary <?php echo e(Auth::user()->type == 4 ? (helper::check_access('role_global_extras', Auth::user()->role_id, Auth::user()->vendor_id, 'add') == 1 ? '' : 'd-none') : ''); ?>"
                                    <?php if(env('Environment') == 'sendbox'): ?> type="button"
                                    onclick="myFunction()" <?php else: ?> type="submit" <?php endif; ?>><?php echo e(trans('labels.save')); ?></button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/global_extras/add.blade.php ENDPATH**/ ?>