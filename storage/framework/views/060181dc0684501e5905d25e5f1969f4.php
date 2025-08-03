<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.menu')); ?> | <?php echo e(@$categorydata->category_name); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
    <?php if(!empty($categorydata)): ?>
        <div class="breadcrumb-sec mb-3">
            <div class="container">
                <div class="breadcrumb-sec-content">
                    <nav class="text-dark breadcrumb-divider" aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li
                                class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?>">
                                <a class="text-dark fw-600" href="<?php echo e(URL::to('/')); ?>"><?php echo e(trans('labels.home')); ?></a>
                            </li>
                            <li class="breadcrumb-item <?php echo e(session()->get('direction') == '2' ? 'breadcrumb-item-rtl ps-0' : ''); ?> active"
                                aria-current="page"><?php echo e(@$categorydata->category_name); ?></li>
                        </ol>
                    </nav>
                </div>
            </div>
        </div>
        <section class="menu-section">
            <div class="container">
                <div class="row">
                    <div class="filter-sidebar mb-3">
                        <div class="sidebar-wrap" id="style-3">
                            <?php if(count($subcategories) > 0 || count($getitemlist) > 0): ?>
                                <a href="<?php echo e(URL::to('/menu?category=' . $categorydata->slug)); ?>"
                                    class="<?php if(!isset($_GET['subcategory'])): ?> active <?php endif; ?>"><?php echo e(trans('labels.all')); ?></a>
                            <?php endif; ?>
                            <?php $__currentLoopData = $subcategories; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $subcatdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <a href="<?php echo e(URL::to('/menu?category=' . $categorydata->slug . '&subcategory=' . $subcatdata->slug)); ?>"
                                    class="<?php if(isset($_GET['subcategory']) && $_GET['subcategory'] == $subcatdata->slug): ?> active <?php endif; ?>"><?php echo e(ucfirst($subcatdata->subcategory_name)); ?></a>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </div>
                    </div>
                    <div class="mb-4">
                        <div class="d-flex bg-primary-rgb p-3 rounded-3 justify-content-between align-items-center">
                            <span class="fs-15 fw-600">
                                <?php echo e(trans('labels.showing')); ?>

                                <?php echo e($getitemlist->firstItem() ? $getitemlist->firstItem() : 0); ?>–<?php echo e($getitemlist->lastItem() ? $getitemlist->lastItem() : 0); ?>

                                <?php echo e(trans('labels.of')); ?>

                                <?php echo e($getitemlist->total()); ?> <?php echo e(trans('labels.result')); ?>

                            </span>
                            <ul class="d-flex flex-nowrap justify-content-end gap-2 nav nav-pills nav-pills-dark"
                                id="tour-pills-tab" role="tablist">

                                <!-- Tab item -->
                                <li class="nav-item">
                                    <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark service-active"
                                        id="column" tooltip="Grid view">
                                        <i class="fa-solid fa-grid-2"></i>
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link view-list-grid cursor-pointer text-dark border border-dark"
                                        id="grid" tooltip="List view">
                                        <i class="fa-solid fa-list-ul"></i>
                                    </a>
                                </li>
                                <!-- Tab item -->
                            </ul>
                        </div>
                    </div>
                    <?php if(count($getitemlist) > 0): ?>
                        <div class="menu my-0">
                            <div class="listing-view">
                                <?php if(helper::appdata()->product_card_view == 1): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col menu">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 2): ?>
                                    <div
                                        class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col theme-2-menu">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 3): ?>
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col theme-3">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 4): ?>
                                    <div
                                        class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col theme-4">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 5): ?>
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 6): ?>
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 7): ?>
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 8): ?>
                                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.grid_view.gridview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div id="column-view" class="d-none">
                                <?php if(helper::appdata()->product_card_view == 1): ?>
                                    <div
                                        class="row row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4 menu-special">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 2): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-list">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 3): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-3-card">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 4): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col theme-4-list">
                                                <?php echo $__env->make('web.product_card.list_view.listview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 5): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 6): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 7): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php elseif(helper::appdata()->product_card_view == 8): ?>
                                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                        <?php $__currentLoopData = $getitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                            <div class="col">
                                                <?php echo $__env->make('web.product_card.list_view.listview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                            </div>
                                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                            
                        </div>
                        <div class="mt-5 d-flex justify-content-center">
                            <?php echo e($getitemlist->appends(request()->query())->links()); ?>

                        </div>
                    <?php else: ?>
                        <?php echo $__env->make('web.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                    <?php endif; ?>
                </div>
            </div>
        </section>
        <?php echo $__env->make('web.subscribeform', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <?php else: ?>
        <?php echo $__env->make('web.nodata', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <?php endif; ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/menu.blade.php ENDPATH**/ ?>