<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <div class="card border-0">
                    <div class="card-body">
                        <div class="form-validation">
                            <form action="<?php echo e(URL::to('admin/store-review/store')); ?>" method="post"
                                enctype="multipart/form-data">
                                <?php echo csrf_field(); ?>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label" for="name"><?php echo e(trans('labels.full_name')); ?>

                                                <span class="text-danger">*</span> </label>
                                            <input type="text" class="form-control" name="name"
                                                value="<?php echo e(old('name')); ?>" id="name"
                                                placeholder="<?php echo e(trans('labels.name')); ?>" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label" for="ratting"><?php echo e(trans('labels.rating')); ?> <span
                                                    class="text-danger">*</span> </label>
                                            <select id="ratting" name="ratting" class="form-select" required>
                                                <option value="" hidden><?php echo e(trans('labels.select')); ?>

                                                </option>
                                                <option value="1" <?php echo e(old('ratting') == '1' ? 'selected' : ''); ?>>1
                                                </option>
                                                <option value="2" <?php echo e(old('ratting') == '2' ? 'selected' : ''); ?>>2
                                                </option>
                                                <option value="3" <?php echo e(old('ratting') == '3' ? 'selected' : ''); ?>>3
                                                </option>
                                                <option value="4" <?php echo e(old('ratting') == '4' ? 'selected' : ''); ?>>4
                                                </option>
                                                <option value="5" <?php echo e(old('ratting') == '5' ? 'selected' : ''); ?>>5
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label" for="image"><?php echo e(trans('labels.image')); ?><span
                                                    class="text-danger">*</span> </label>
                                            <input type="file" class="form-control" name="image"
                                                value="<?php echo e(old('image')); ?>" id="image" required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label" for="comment"><?php echo e(trans('labels.description')); ?>

                                                <span class="text-danger">*</span> </label>
                                            <textarea class="form-control" name="comment" id="comment" rows="2" required
                                                placeholder="<?php echo e(trans('labels.description')); ?>"><?php echo e(old('comment')); ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group <?php echo e(session()->get('direction') == '2' ? 'text-start' : 'text-end'); ?>">
                                    <a href="<?php echo e(URL::to('admin/store-review')); ?>"
                                        class="btn btn-danger"><?php echo e(trans('labels.cancel')); ?></a>
                                    <button class="btn btn-primary"
                                        <?php if(env('Environment') == 'sendbox'): ?> type="button"
                                    onclick="myFunction()" <?php else: ?> type="submit" <?php endif; ?>><?php echo e(trans('labels.save')); ?></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/included/store_review/add.blade.php ENDPATH**/ ?>