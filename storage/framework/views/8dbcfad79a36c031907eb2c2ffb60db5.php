<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.favourite_list')); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
    <div class="breadcrumb-sec">
        <div class="container">
            <div class="breadcrumb-sec-content">
                <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                    <ol class="breadcrumb">
                        <li
                            class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?>">
                            <a class="text-dark fw-600" href="<?php echo e(route('home')); ?>"><?php echo e(trans('labels.home')); ?></a>
                        </li>
                        <li class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?> active"
                            aria-current="page"><?php echo e(trans('labels.favourite_list')); ?></li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>
    <section>
        <div class="menu-background">
        <div class="container my-5 favourite">
            <div class="row">
                <div class="col-lg-3">
                    <?php echo $__env->make('web.layout.usersidebar', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                </div>
                <div class="col-lg-9 d-flex">
                    <div class="user-content-wrapper">
                        <p class="title border-bottom pb-3 mb-1"><?php echo e(trans('labels.favourite_list')); ?></p>
                        <?php if(count($getfavoritelist) > 0): ?>
                            <?php if(helper::appdata()->product_card_view == 1): ?>
                                <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col menu">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 2): ?>
                                <div
                                    class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col theme-2-menu">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 3): ?>
                                <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col theme-3">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 4): ?>
                                <div
                                    class="row row-cols-xxl-4 row-cols-lg-3 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col theme-4">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 5): ?>
                                <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 6): ?>
                                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 7): ?>
                                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php elseif(helper::appdata()->product_card_view == 8): ?>
                                <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3 m-0">
                                    <?php $__currentLoopData = $getfavoritelist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="col">
                                            <?php echo $__env->make('web.product_card.grid_view.gridview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            <?php endif; ?>
                            <div class="mt-3 d-flex justify-content-center">
                                <?php echo e($getfavoritelist->links()); ?>

                            </div>
                        <?php else: ?>
                            <div class="my-5 py-5">
                                <?php echo $__env->make('web.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
        </div>
    </section>
    <?php echo $__env->make('web.subscribeform', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/favoritelist.blade.php ENDPATH**/ ?>