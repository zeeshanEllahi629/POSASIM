<?php if(count($getitemlist) > 0): ?>
<div class="row row-cols-xl-1 row-cols-lg-1 row-cols-md-2 row-cols-sm-2 row-cols-1 g-1 menu-special">
    <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <div class="col-md-12 mb-2">
            <?php echo $__env->make('web.product_card.list_view.listview_1_alt', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
        </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
<?php else: ?>
        <?php echo $__env->make('web.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php endif; ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/product_menu.blade.php ENDPATH**/ ?>