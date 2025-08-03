<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card border-0">
                    <div class="card-body">
                        <div class="form-group">
                            <label class="col-form-label" for="item_name"><?php echo e(trans('labels.item_name')); ?></label>
                            <select name="item_name" class="form-select" id="item_name">
                                <option value="" selected><?php echo e(trans('labels.select')); ?></option>
                                <?php $__currentLoopData = $getproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $product): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <option value="<?php echo e(@$product->id); ?>" <?php echo e($sorter == @$product->id ? 'selected' : ''); ?>>
                                        <?php echo e(@$product->item_name); ?>

                                    </option>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </select>
                        </div>
                        <div class="table-responsive" id="table-display">
                            <?php echo $__env->make('admin.reviews.table', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form id="filter_review">
        <input type="hidden" name="item_id" id="sorter_item_name" value="<?php echo e(@$sorter); ?>">
    </form>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('script'); ?>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'admin-assets/assets/js/custom/reviews.js')); ?>"></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/reviews/reviews.blade.php ENDPATH**/ ?>