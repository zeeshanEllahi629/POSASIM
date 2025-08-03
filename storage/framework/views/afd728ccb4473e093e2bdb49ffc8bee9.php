    <?php
    if ($itemdata->is_top_deals == 1 && $topdeals != null) {
        if (@$topdeals->offer_type == 1) {
            if ($itemdata->item_price > @$topdeals->offer_amount) {
                $price = $itemdata->item_price - @$topdeals->offer_amount;
            } else {
                $price = $itemdata->item_price;
            }
        } else {
            $price = $itemdata->item_price - $itemdata->item_price * (@$topdeals->offer_amount / 100);
        }
        $original_price = $itemdata->item_price;
        $off = $original_price > 0 ? number_format(100 - ($price * 100) / $original_price, 1) : 0;
    } else {
        $price = $itemdata->item_price;
        $original_price = $itemdata->original_price;
        $off = $itemdata->discount_percentage;
    }
?>
<div class="card rounded-4 overflow-hidden h-100">
    <a href="<?php echo e(URL::to('item-' . $itemdata->slug)); ?>">
        <div class="card-image">
            <img src="<?php echo e(@helper::image_path($itemdata['item_image']->image_name)); ?>"
                class="card-img-top border-0 rounded-0 rounded-top position-relative" alt="dishes">
        </div>
    </a>
    <div class="card-body pb-0 border-bottom">
        <div class="d-flex align-items-center mb-2 justify-content-between">
            <div class="cat-name py-1 px-2 col-auto text-center">
                <span><?php echo e($itemdata['category_info']->category_name); ?></span>
            </div>
            <?php if(@helper::checkaddons('product_review')): ?>
                <?php if(helper::appdata()->review_approved_status == 1): ?>
                    <div class="d-flex fs-8 align-items-center">
                        <i class="fa-solid fa-star text-warning"></i>
                        <p class="m-0 text-dark fw-500 <?php echo e(session()->get('direction') == '2' ? 'pe-1' : 'ps-1'); ?>">
                            <?php echo e(number_format($itemdata->avg_ratting, 1)); ?></p>
                    </div>
                <?php endif; ?>
            <?php endif; ?>
        </div>
        <h5 class="item-card-title pb-3 fs-6 d-flex">
            <?php if($itemdata->item_type == 1): ?>
                <img src="<?php echo e(helper::image_path('veg.svg')); ?>" alt=""
                    class="<?php echo e(session()->get('direction') == '2' ? 'ms-1' : 'me-1'); ?>">
            <?php else: ?>
                <img src="<?php echo e(helper::image_path('nonveg.svg')); ?>" alt=""
                    class="<?php echo e(session()->get('direction') == '2' ? 'ms-1' : 'me-1'); ?>">
            <?php endif; ?>
            <div class="d-flex align-items-center gap-1">
                <a href="<?php echo e(URL::to('item-' . $itemdata->slug)); ?>">
                    <p class="item-card-title mb-0 line-2 fs-7">
                        <?php echo e($itemdata->item_name); ?>

                    </p>
                </a>
                <?php if($itemdata->item_allergens != null): ?>
                    <div type="button"
                        onclick="itemsallergens('<?php echo e($itemdata->id); ?>','<?php echo e(route('get_item_allergens')); ?>')">
                        <div class="btn-allergens">
                            <i class="fa-solid fa-info"></i>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </h5>
    </div>


    <?php if($off > 0): ?>
        <div class="offer-lable <?php echo e(session()->get('direction') == '2' ? 'rtl' : ''); ?>">
            <h5><?php echo e($off); ?>% <?php echo e(trans('labels.off')); ?></h5>
        </div>
    <?php endif; ?>
    <?php if(request()->is('favouritelist')): ?>
        <div class="img-overlay <?php echo e(session()->get('direction') == '2' ? 'rtl' : ''); ?> set-fav-8">
            <?php if(Auth::user() && Auth::user()->type == 2): ?>
                <?php if($itemdata->is_favorite == 1): ?>
                    <a class="heart-icon bg-section-rgb-dark p-2 btn " href="javascript:void(0)"
                        onclick="managefavorite('<?php echo e($itemdata->id); ?>',0,'<?php echo e(URL::to('/managefavorite')); ?>','<?php echo e(request()->url()); ?>')"
                        title="Remove to Wishlist">
                        <i class="fa-solid fa-heart fs-5"></i>
                    </a>
                <?php else: ?>
                    <a class="heart-icon bg-section-rgb-dark p-2 btn " href="javascript:void(0)"
                        onclick="managefavorite('<?php echo e($itemdata->id); ?>',1,'<?php echo e(URL::to('/managefavorite')); ?>','<?php echo e(request()->url()); ?>')"
                        title="Add to Wishlist">
                        <i class="fa-regular fa-heart fs-5"></i>
                    </a>
                <?php endif; ?>
            <?php endif; ?>
        </div>
    <?php endif; ?>
    <div class="item-card-footer">
        <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex justify-content-between align-items-center gap-2">
                <span><?php echo e(helper::currency_format($price)); ?></span>
                <?php if($original_price > $price): ?>
                    <del class="text-muted"><?php echo e(helper::currency_format($original_price)); ?></del>
                <?php endif; ?>
            </div>
            <?php if($itemdata->is_cart == 1): ?>
                <div class="item-quantity py-1 px-5">
                    <button type="button" class="btn btn-sm  fw-500"
                        onclick="removefromcart('<?php echo e(URL::to('/cart')); ?>','<?php echo e(trans('messages.remove_cartitem_note')); ?>','<?php echo e(trans('labels.goto_cart')); ?>')">-</button>
                    <input class="fw-500 item-total-qty-<?php echo e($itemdata->slug); ?>" type="text"
                        value="<?php echo e(helper::get_item_cart($itemdata->id)); ?>" disabled />
                    <button class="btn btn-sm fw-500 border-0"
                        onclick="showitem('<?php echo e($itemdata->slug); ?>','<?php echo e(URL::to('/show-item')); ?>')">+</button>
                </div>
            <?php else: ?>
                <button
                    class="btn btn-sm btn-secondary fw-500 py-2 px-4 float-end rounded-3 d-flex gap-2 justify-content-center align-items-center addon_modal_<?php echo e($itemdata->slug); ?>"
                    onclick="showitem('<?php echo e($itemdata->slug); ?>','<?php echo e(URL::to('/show-item')); ?>')">
                    <?php echo e(trans('labels.add')); ?>

                    <i class="fa-solid fa-plus addon_modal_icon_<?php echo e($itemdata->slug); ?>"></i>
                    <div class="loader d-none addon_modal_loader_<?php echo e($itemdata->slug); ?>"></div>
                </button>
            <?php endif; ?>
        </div>
    </div>
</div>
<?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/product_card/grid_view/gridview_1.blade.php ENDPATH**/ ?>