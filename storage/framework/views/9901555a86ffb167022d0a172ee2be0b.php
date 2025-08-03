<div class="row g-3 my-3">
    <div class="col-xl-3 col-sm-6 col-12">
        <div class="card  box-shadow h-100  <?php echo e(request()->get('status') == '' ? 'border border-primary' : 'border-0'); ?>">
            <a
                href="<?php echo e(URL::to(request()->url() . '?customer_id=' . request()->get('customer_id') . '&startdate=' . request()->get('startdate') . '&enddate=' . request()->get('enddate'))); ?>">
                <div class="card-body">
                    <div class="dashboard-card">
                        <span class="card-icon">
                            <i class="fa fa-shopping-cart"></i>
                        </span>
                        <span class="text-end">
                            <p class="text-dark fs-15 fw-500 mb-1"><?php echo e(trans('labels.total_orders')); ?></p>
                            <h4><?php echo e($totalorders); ?></h4>
                        </span>
                    </div>
                </div>
            </a>
        </div>
    </div>
    <div class="col-xl-3 col-sm-6 col-12">
        <div
            class="card box-shadow h-100 <?php echo e(request()->get('status') == 'processing' ? 'border border-primary' : 'border-0'); ?>">
            <a
                href="<?php echo e(URL::to(request()->url() . '?status=processing&customer_id=' . request()->get('customer_id') . '&startdate=' . request()->get('startdate') . '&enddate=' . request()->get('enddate'))); ?>">
                <div class="card-body">
                    <div class="dashboard-card">
                        <span class="card-icon">
                            <i class="fa fa-hourglass"></i>
                        </span>
                        <span class="text-end">
                            <p class="text-dark fs-15 fw-500 mb-1"><?php echo e(trans('labels.processing')); ?></p>
                            <h4><?php echo e($totalprocessing); ?></h4>
                        </span>
                    </div>
                </div>
            </a>
        </div>
    </div>
    <div class="col-xl-3 col-sm-6 col-12">
        <div
            class="card box-shadow h-100 <?php echo e(request()->get('status') == 'completed' ? 'border border-primary' : 'border-0'); ?>">
            <a
                href="<?php echo e(URL::to(request()->url() . '?status=completed&customer_id=' . request()->get('customer_id') . '&startdate=' . request()->get('startdate') . '&enddate=' . request()->get('enddate'))); ?>">
                <div class="card-body">
                    <div class="dashboard-card">
                        <span class="card-icon">
                            <i class="fa fa-check"></i>
                        </span>
                        <span class="text-end">
                            <p class="text-dark fs-15 fw-500 mb-1"><?php echo e(trans('labels.completed')); ?></p>
                            <h4><?php echo e($totalcompleted); ?></h4>
                        </span>
                    </div>
                </div>
            </a>
        </div>
    </div>
    <div class="col-xl-3 col-sm-6 col-12">
        <div
            class="card  box-shadow h-100 <?php echo e(request()->get('status') == 'cancelled' ? 'border border-primary' : 'border-0'); ?>">
            <a
                href="<?php echo e(URL::to(request()->url() . '?status=cancelled&customer_id=' . request()->get('customer_id') . '&startdate=' . request()->get('startdate') . '&enddate=' . request()->get('enddate'))); ?>">
                <div class="card-body">
                    <div class="dashboard-card">
                        <span class="card-icon">
                            <i class="fa fa-close"></i>
                        </span>
                        <span class="text-end">
                            <p class="text-dark fs-15 fw-500 mb-1"><?php echo e(trans('labels.cancelled')); ?></p>
                            <h4><?php echo e($totalcancelled); ?></h4>
                        </span>
                    </div>
                </div>
            </a>
        </div>
    </div>
    <?php if(request()->is('admin/report*')): ?>
        <div class="col-xl-3 col-sm-6 col-12">
            <div class="card border-0 box-shadow h-100">
                <div class="card-body">
                    <div class="dashboard-card">
                        <span class="card-icon">
                            <i class="fa-regular fa-money-bill-1-wave"></i>
                        </span>
                        <span class="text-end">
                            <p class="text-dark fs-15 fw-500 mb-1"><?php echo e(trans('labels.revenue')); ?></p>
                            <h4><?php echo e(helper::currency_format($totalearnings)); ?></h4>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
</div>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/orders/statistics.blade.php ENDPATH**/ ?>