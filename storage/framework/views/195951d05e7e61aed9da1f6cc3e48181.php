<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('admin.breadcrumb', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <form action="<?php echo e(URL::to('admin/shipping/savecontent')); ?>" method="POST" enctype="multipart/form-data">
                    <?php echo csrf_field(); ?>
                    <div class="card border-0 mb-3 p-3 box-shadow">
                        <div class="row">
                            <div class="col-md-6 mb-lg-0">
                                <div class="form-group">
                                    <label class="form-label"><?php echo e(trans('labels.min_order_amount_for_free_shipping')); ?>

                                        <span class="text-danger"> * </span></label>
                                    <input type="text"
                                        class="form-control <?php echo e(session()->get('direction') == 2 ? 'input-group-rtl' : ''); ?>"
                                        name="min_order_amount_for_free_shipping"
                                        placeholder="<?php echo e(trans('labels.min_order_amount_for_free_shipping')); ?>"
                                        value="<?php echo e($content->min_order_amount_for_free_shipping); ?>" required>
                                </div>
                            </div>
                            <?php if(@helper::checkaddons('shipping_area')): ?>
                                <div class="col-md-6 mb-lg-0">
                                    <div class="form-group">
                                        <label class="form-label" for=""><?php echo e(trans('labels.shipping_area')); ?></label>
                                        <?php if(env('Environment') == 'sendbox'): ?>
                                            <span class="badge bg-danger"><?php echo e(trans('labels.addon')); ?></span>
                                        <?php endif; ?>
                                        <input id="shipping_area-switch" type="checkbox" class="checkbox-switch"
                                            name="shipping_area" value="1"
                                            <?php echo e($content->shipping_area == 1 ? 'checked' : ''); ?>>
                                        <label for="shipping_area-switch" class="switch">
                                            <span
                                                class="<?php echo e(session()->get('direction') == 2 ? 'switch__circle-rtl' : 'switch__circle'); ?>"><span
                                                    class="switch__circle-inner"></span></span>
                                            <span
                                                class="switch__left <?php echo e(session()->get('direction') == 2 ? 'pe-1' : 'ps-1'); ?>"><?php echo e(trans('labels.off')); ?></span>
                                            <span
                                                class="switch__right <?php echo e(session()->get('direction') == 2 ? 'ps-2' : 'pe-2'); ?>"><?php echo e(trans('labels.on')); ?></span>
                                        </label>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <div class="col-md-6 mb-lg-0" id="shipping_charges_section">
                                <div class="form-group">
                                    <label class="form-label"><?php echo e(trans('labels.shipping_charges')); ?>

                                        <span class="text-danger"> *</span></label>
                                    <input type="text"
                                        class="form-control <?php echo e(session()->get('direction') == 2 ? 'input-group-rtl' : ''); ?>"
                                        name="shipping_charges" placeholder="<?php echo e(trans('labels.shipping_charges')); ?>"
                                        value="<?php echo e($content->shipping_charges); ?>" id="shipping_charges" required>
                                </div>
                            </div>
                            <div class="<?php echo e(session()->get('direction') == 2 ? 'text-start' : 'text-end'); ?>">
                                <button
                                    <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" type="button" <?php else: ?> type="submit" <?php endif; ?>
                                    class="btn btn-primary px-sm-4"><?php echo e(trans('labels.save')); ?></button>
                            </div>
                        </div>
                    </div>
                </form>

                <?php if(@helper::checkaddons('shipping_area')): ?>
                    <?php if(helper::appdata()->shipping_area == 1): ?>
                        <div class="card border-0 mb-3 box-shadow">
                            <div class="d-flex justify-content-between align-items-center mx-3 mt-3">
                                <ol class="breadcrumb m-0">
                                    <li class="breadcrumb-item fs-5 fw-bold">
                                        <?php echo e(trans('labels.shipping_area')); ?>

                                    </li>
                                </ol>
                                <a href="<?php echo e(URL::to(request()->url() . '/add')); ?>" class="btn btn-primary px-sm-4">
                                    <i class="fa-regular fa-plus mx-1"></i><?php echo e(trans('labels.add_new')); ?></a>
                            </div>

                            <div class="card-body">
                                <div class="table-responsive">
                                    <table
                                        class="table table-striped table-bordered zero-configuration w-100 dataTable no-footer">
                                        <thead>
                                            <tr class="text-capitalize fw-500 fs-15">
                                                <td></td>
                                                <td>#</td>
                                                <td><?php echo e(trans('labels.area_name')); ?></td>
                                                <td><?php echo e(trans('labels.delivery_charge')); ?></td>
                                                <td><?php echo e(trans('labels.status')); ?></td>
                                                <td><?php echo e(trans('labels.created_date')); ?></td>
                                                <td><?php echo e(trans('labels.updated_date')); ?></td>
                                                <td><?php echo e(trans('labels.action')); ?></td>
                                            </tr>
                                        </thead>

                                        <tbody id="tabledetails" data-url="<?php echo e(url('admin/shipping/reorder_shipping')); ?>">
                                            <?php $__currentLoopData = $allshippingcontent; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $content): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                                <tr class="fs-7 row1 align-middle" id="dataid<?php echo e($content->id); ?>"
                                                    data-id="<?php echo e($content->id); ?>">
                                                    <td>
                                                        <a tooltip="<?php echo e(trans('labels.move')); ?>">
                                                            <i class="fa-light fa-up-down-left-right mx-2"></i>
                                                        </a>
                                                    </td>
                                                    <td><?php echo e(++$key); ?></td>
                                                    <td><?php echo e($content->area_name); ?></td>
                                                    <td><?php echo e(helper::currency_format($content->delivery_charge)); ?>

                                                    </td>
                                                    <td>
                                                        <?php if($content->is_available == '1'): ?>
                                                            <a href="javascript:void(0)"
                                                                tooltip="<?php echo e(trans('labels.active')); ?>"
                                                                <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="StatusUpdate('<?php echo e($content->id); ?>','2','<?php echo e(URL::to('admin/shipping/status')); ?>')" <?php endif; ?>
                                                                class="btn btn-sm btn-success square">
                                                                <i class="fa-sharp fa-solid fa-check"></i>
                                                            </a>
                                                        <?php else: ?>
                                                            <a href="javascript:void(0)"
                                                                tooltip="<?php echo e(trans('labels.deactive')); ?>"
                                                                <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="StatusUpdate('<?php echo e($content->id); ?>','1','<?php echo e(URL::to('admin/shipping/status')); ?>')" <?php endif; ?>
                                                                class="btn btn-sm btn-danger square">
                                                                <i class="fa-sharp fa-solid fa-xmark"></i>
                                                            </a>
                                                        <?php endif; ?>
                                                    </td>
                                                    <td>
                                                        <?php echo e(helper::date_format($content->created_at)); ?><br>
                                                        <?php echo e(helper::time_format($content->created_at)); ?>

                                                    </td>
                                                    <td>
                                                        <?php echo e(helper::date_format($content->updated_at)); ?><br>
                                                        <?php echo e(helper::time_format($content->updated_at)); ?>

                                                    </td>
                                                    <td>
                                                        <div class="d-flex flex-wrap gap-2">
                                                            <a href="<?php echo e(URL::to('/admin/shipping/edit-' . $content->id)); ?>"
                                                                tooltip="<?php echo e(trans('labels.edit')); ?>"
                                                                class="btn btn-info btn-sm square">
                                                                <i class="fa fa-pen-to-square"></i>
                                                            </a>

                                                            <a href="javascript:void(0)"
                                                                tooltip="<?php echo e(trans('labels.delete')); ?>"
                                                                <?php if(env('Environment') == 'sendbox'): ?> onclick="myFunction()" <?php else: ?> onclick="Delete('<?php echo e($content->id); ?>','<?php echo e(URL::to('admin/shipping/delete')); ?>')" <?php endif; ?>
                                                                class="btn btn-danger btn-sm square">
                                                                <i class="fa fa-trash"></i>
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('script'); ?>
    <script>
        $("#shipping_area-switch").on("change", function(e) {
            if (this.checked) {
                $("#shipping_charges_section").hide();
                $("#shipping_charges").prop("required", false);
            } else {
                $("#shipping_charges_section").show();
                $("#shipping_charges").prop("required", true);
            }
        }).change();
    </script>
    <script src="<?php echo e(url(env('ASSETSPATHURL') . 'admin-assets/assets/js/custom/shipping.js')); ?>"></script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.theme.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/admin/shipping/index.blade.php ENDPATH**/ ?>