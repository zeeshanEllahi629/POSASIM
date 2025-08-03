<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-lg-12">
                <div class="card border-0">
                    <div class="card-body">
                        <div class="form-validation">
                            <form action="<?php echo e(URL::to('admin/our-team/store')); ?>" method="post" enctype="multipart/form-data">
                                <?php echo csrf_field(); ?>
                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label" for=""><?php echo e(trans('labels.name')); ?> <span
                                                    class="text-danger">*</span> </label>
                                            <input type="text" class="form-control" name="name"
                                                value="<?php echo e(old('name')); ?>" placeholder="<?php echo e(trans('labels.name')); ?>"
                                                required>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-form-label" for=""><?php echo e(trans('labels.designation')); ?>

                                                <span class="text-danger">*</span> </label>
                                            <input type="text" class="form-control" name="designation"
                                                value="<?php echo e(old('designation')); ?>"
                                                placeholder="<?php echo e(trans('labels.designation')); ?>" required>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-form-label" for=""><?php echo e(trans('labels.image')); ?>

                                                <span class="text-danger">*</span> </label>
                                            <input type="file" class="form-control" name="image" accept="image/*"
                                                required>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label" for=""><?php echo e(trans('labels.description')); ?>

                                                <span class="text-danger">*</span> </label>
                                            <textarea class="form-control" name="description" rows="6" placeholder="<?php echo e(trans('labels.description')); ?>"
                                                required><?php echo e(old('description')); ?></textarea>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label"
                                                for=""><?php echo e(trans('labels.facebook_link')); ?></label>
                                            <input type="url" class="form-control" name="fb"
                                                value="<?php echo e(old('fb')); ?>"
                                                placeholder="<?php echo e(trans('labels.facebook_link')); ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label"
                                                for=""><?php echo e(trans('labels.youtube_link')); ?></label>
                                            <input type="url" class="form-control" name="youtube"
                                                value="<?php echo e(old('youtube')); ?>"
                                                placeholder="<?php echo e(trans('labels.youtube_link')); ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label"
                                                for=""><?php echo e(trans('labels.instagram_link')); ?></label>
                                            <input type="url" class="form-control" name="insta"
                                                value="<?php echo e(old('insta')); ?>"
                                                placeholder="<?php echo e(trans('labels.instagram_link')); ?>">
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-group">
                                            <label class="col-form-label"
                                                for=""><?php echo e(trans('labels.twitter_link')); ?></label>
                                            <input type="url" class="form-control" name="twitter"
                                                value="<?php echo e(old('twitter')); ?>"
                                                placeholder="<?php echo e(trans('labels.twitter_link')); ?>">
                                        </div>
                                    </div>
                                </div>
                                <div class="form-group <?php echo e(session()->get('direction') == '2' ? 'text-start' : 'text-end'); ?>">
                                    <a href="<?php echo e(URL::to('admin/our-team')); ?>"
                                        class="btn btn-danger"><?php echo e(trans('labels.cancel')); ?></a>
                                    <button class="btn btn-primary"
                                        <?php if(env('Environment') == 'sendbox'): ?> type="button" onclick="myFunction()" <?php else: ?> type="submit" <?php endif; ?>><?php echo e(trans('labels.save')); ?></button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/team/add.blade.php ENDPATH**/ ?>