<?php $__env->startSection('page_title'); ?>
    | <?php echo e(trans('labels.home')); ?>

<?php $__env->stopSection(); ?>
<?php $__env->startSection('content'); ?>
    <!-- Slider Area Start Here -->
    <?php if(count($sliders) > 0): ?>
        <section class="slider-area">
            <div id="slidercarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <?php $__currentLoopData = $sliders; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $sliderdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="carousel-item <?php echo e($key == 0 ? 'active' : ''); ?>">
                            <img src="<?php echo e(helper::image_path($sliderdata->image)); ?>" class="d-block img-fluid" alt="slider">
                            <div class="carousel-caption d-flex h-100 align-items-center justify-content-center flex-column">
                                <h5 class="animate__animated animate__fadeInUp"><?php echo e($sliderdata->title); ?></h5>
                                <p class="animate__animated animate__fadeInUp"><?php echo e($sliderdata->description); ?></p>






                                    <a href="<?php echo e(URL::to('/menus')); ?>"
                                        class="btn btn-primary fw-500 px-4 py-2 animate__animated animate__fadeInUp"><?php echo e(trans('labels.explore')); ?>

                                        <i class="fa-solid fa-circle-arrow-right"></i> </a>

                            </div>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
                <button class="carousel-control-prev <?php echo e(count($sliders) == 1 ? 'd-none' : ''); ?>" type="button"
                    data-bs-target="#slidercarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                </button>
                <button class="carousel-control-next <?php echo e(count($sliders) == 1 ? 'd-none' : ''); ?>" type="button"
                    data-bs-target="#slidercarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                </button>
            </div>
        </section>
    <?php endif; ?>
    <!-- Slider Area End Here -->

    <!-- Promotional topbanners Start Here -->
    <?php if(count($banners['topbanners']) > 0): ?>
        <section class="theme-1-banner1 sec-padding">
            <div class="container">
                <div class="slider-small owl-carousel owl-theme">
                    <?php $__currentLoopData = $banners['topbanners']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $bannerdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="item">
                            <?php if($bannerdata['item_info'] != ''): ?>
                                <a href="<?php echo e(URL::to('/item-' . $bannerdata['item_info']->slug)); ?>">
                                <?php elseif($bannerdata['category_info'] != ''): ?>
                                    <a href="<?php echo e(URL::to('/menu/?category=' . $bannerdata['category_info']->slug)); ?>">
                                    <?php else: ?>
                                        <a href="javascript:void(0);">
                            <?php endif; ?>
                            <img src="<?php echo e($bannerdata['image']); ?>" alt="banner" class="rounded-4">
                            </a>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            </div>
        </section>
    <?php endif; ?>
    <!-- Promotional topbanners End Here -->

    <!-- Why Choose Us Start Here -->
    <?php if(count($getwhychooseus) > 0): ?>
        <section class="about sec-padding pt-0">
            <div class="container">
                <div class="row g-md-5 g-3">
                    <div class="col-lg-6 d-md-block d-none">
                        <div class="about-img h-100"><img
                                src="<?php echo e(helper::image_path(helper::appdata()->why_choose_image)); ?>"
                                class="w-100 h-100 object-fit-cover rounded-4" alt=""></div>
                    </div>
                    <div class="col-lg-6">
                        <div class="h-100 d-flex align-items-center py-md-4">
                            <div class="about-details">
                                <h1 class="text-uppercase"><?php echo e(helper::appdata()->why_choose_title); ?></h1>
                                <p class="sub-lables text-capitalize mt-2 mb-0">
                                    <?php echo e(helper::appdata()->why_choose_subtitle); ?>

                                </p>
                                <p class="mb-4 line-4"><?php echo e(helper::appdata()->why_choose_description); ?></p>
                                <div class="row g-4">
                                    <?php $__currentLoopData = $getwhychooseus; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $whychooseus): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                        <div class="d-flex align-items-center">
                                            <div class="service-icon">
                                                <img src="<?php echo e(helper::image_path($whychooseus->image)); ?>" alt=""
                                                    class="w-100 h-100">
                                            </div>
                                            <div class="<?php echo e(session()->get('direction') == '2' ? 'pe-3' : 'ps-3'); ?>">
                                                <h4 class="service-name mb-1 line-1"><?php echo e($whychooseus->title); ?></h4>
                                                <p class="service-des mb-0 line-2"><?php echo e($whychooseus->subtitle); ?></p>
                                            </div>
                                        </div>
                                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    <?php endif; ?>
    <!-- Why Choose Us End Here -->

    <!-- Category Section Start Here -->
    <?php if(count(helper::get_categories()) > 0): ?>
        <section class="category position-relative bg-section-gray sec-padding">
            <div class="container">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                        <div class="row g-2 align-items-center justify-content-between mb-sm-5 mb-4">
                            <div class="col-auto">
                                <h1 class="text-uppercase fw-bold"><?php echo e(trans('labels.categories')); ?></h1>
                                <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.top_categories')); ?></p>
                            </div>
                            <div class="col-auto text-end align-center">
                                <a href="<?php echo e(route('categories')); ?>"
                                    class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?></a>
                            </div>
                        </div>
                        <div id="category" class="owl-carousel mt-2">
                            <?php $__currentLoopData = helper::get_categories(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $categorydata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <div class="category-wrapper category-item rounded-4">
                                    <a href="<?php echo e(URL::to('/menu/?category=' . $categorydata->slug)); ?>">
                                        <div class="d-flex justify-content-center">
                                            <div class="cat rounded-circle">
                                                <img src="<?php echo e(helper::image_path($categorydata->image)); ?>"
                                                    class="rounded-circle h-100 object-fit-cover" alt="category">
                                            </div>
                                        </div>
                                    </a>
                                    <div class="text-center pt-3 category-text">
                                        <p class="fs-6 fw-500 mb-0"><?php echo e($categorydata->category_name); ?></p>
                                        <p class="fs-7 fw-400 text-primary mb-0"><?php echo e($categorydata->item_info->count()); ?>

                                            <?php echo e(trans('labels.item')); ?></p>
                                    </div>
                                </div>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </div>
                    </div>
                </div>
            </div>
            <div class="burger-shape d-md-block d-none">
                <img src="https://modinatheme.com/html/foodking-html/assets/img/shape/burger-shape-2.png" alt="shape-img">
            </div>
            <div class="fry-shape d-xl-block d-none">
                <img src="https://modinatheme.com/html/foodking-html/assets/img/shape/fry-shape.png" alt="shape-img">
            </div>
        </section>
    <?php endif; ?>
    <!-- Category Section End Here -->

    <!-- topitemlist dishes Section Start Here -->
    <?php if(count($topitemlist) > 0): ?>
        <section class="menu sec-padding position-relative">
            <div class="container">
                <div class="row g-3 align-items-center justify-content-between mb-sm-5 mb-4">
                    <div class="col-auto menu-heading">
                        <h1 class="text-uppercase"><?php echo e(trans('labels.trending')); ?></h1>
                        <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.top_trending')); ?></p>
                    </div>
                    <div class="col-auto">
                        <a href="<?php echo e(URL::to('/view-all?type=topitems')); ?>"
                            class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?></a>
                    </div>
                </div>
                <?php if(helper::appdata()->product_card_view == 1): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col menu">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 2): ?>
                    <div
                        class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-2-menu">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 3): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-3">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 4): ?>
                    <div class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-4">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 5): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 6): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 7): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 8): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $topitemlist; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php endif; ?>
            </div>
            <div class="tomato-shape-1 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/tomato-shape.png')); ?>"
                    alt="shape-img">
            </div>
            <div class="chili-shape-1 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/chili-shape.png')); ?>"
                    alt="shape-img">
            </div>
        </section>
    <?php endif; ?>
    <!-- topitemlist dishes Section End Here -->

    <!-- Promotional bannersection1 Start Here -->
    <?php if(count($banners['bannersection1']) > 0): ?>
        <section class="banner2">
            <div id="banner1" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <?php $__currentLoopData = $banners['bannersection1']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $bannerdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="carousel-item <?php echo e($key == 0 ? 'active' : ''); ?>">
                            <?php if($bannerdata['item_info'] != ''): ?>
                                <a href="<?php echo e(URL::to('/item-' . $bannerdata['item_info']->slug)); ?>">
                                <?php elseif($bannerdata['category_info'] != ''): ?>
                                    <a href=" <?php echo e(URL::to('/menu/?category=' . $bannerdata['category_info']->slug)); ?> ">
                                    <?php else: ?>
                                        <a href="javascript:void(0)">
                            <?php endif; ?>
                            <img src="<?php echo e($bannerdata['image']); ?>" height="400" alt="banner2">
                            </a>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
                <button class="carousel-control-prev <?php echo e(count($banners['bannersection1']) == 1 ? 'd-none' : ''); ?>"
                    type="button" data-bs-target="#banner1" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden"><?php echo e(trans('labels.previous')); ?></span>
                </button>
                <button class="carousel-control-next <?php echo e(count($banners['bannersection1']) == 1 ? 'd-none' : ''); ?>"
                    type="button" data-bs-target="#banner1" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden"><?php echo e(trans('labels.next')); ?></span>
                </button>
            </div>
        </section>
    <?php endif; ?>
    <!-- Promotional bannersection1 End Here -->

    <!-- Table Resrvation Section Start Here -->
    <?php if(helper::appdata()->online_table_booking == 1): ?>
        <section class="table-booking sec-padding pb-0">
            <div class="container">
                <div class="row g-0 align-items-center bg-section-gray rounded-5">
                    <div class="reservation-content col-lg-6 p-sm-5 p-4">
                        <h1 class="text-uppercase"><?php echo e(trans('labels.book_table')); ?></h1>
                        <p class="sub-lables mb-4"><?php echo e(trans('labels.make_reservation')); ?></p>
                        <div>
                            <form class="rounded-5" action="<?php echo e(URL::to('reservation/store')); ?>" method="POST">
                                <?php echo csrf_field(); ?>
                                <div class="row g-md-2 g-3 mb-3">
                                    <div class="col-xl-4 col-md-12 form-group">
                                        <label for="reservation_name"
                                            class="form-label fs-7 mb-1"><?php echo e(trans('labels.full_name')); ?>

                                            <span class="text-danger">*</span>
                                        </label>
                                        <input class="form-control" type="text" name="name"
                                            value="<?php echo e(old('name')); ?>" id="reservation_name"
                                            placeholder="<?php echo e(trans('labels.full_name')); ?>" required>
                                    </div>
                                    <div class="col-xl-4 col-md-6">
                                        <div class="form-group">
                                            <label for="reservation_email"
                                                class="form-label fs-7 mb-1"><?php echo e(trans('labels.email')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input class="form-control" type="email" name="email"
                                                value="<?php echo e(old('email')); ?>" id="reservation_email"
                                                placeholder="<?php echo e(trans('labels.email')); ?>" required>
                                        </div>
                                    </div>
                                    <div class="col-xl-4 col-md-6">
                                        <div class="form-group">
                                            <label for="reservation_mobile"
                                                class="form-label fs-7 mb-1"><?php echo e(trans('labels.mobile')); ?>

                                                <span class="text-danger">*</span>
                                            </label>
                                            <input class="form-control" type="text" name="mobile"
                                                value="<?php echo e(old('mobile')); ?>" id="reservation_mobile"
                                                placeholder="<?php echo e(trans('labels.mobile')); ?>" required>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-2">
                                    <div class="col-md-12">
                                        <div class="row g-md-2 g-3 mb-3">
                                            <div class="col-xl-6 col-md-6">
                                                <div class="form-group">
                                                    <label for="reservation_date"
                                                        class="form-label fs-7 mb-1"><?php echo e(trans('labels.date')); ?>

                                                        <span class="text-danger">*</span>
                                                    </label>
                                                    <input class="form-control" type="date" name="date"
                                                        min="<?php echo date('Y-m-d'); ?>" value="<?php echo e(old('date')); ?>"
                                                        id="reservation_date" required>
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-md-6">
                                                <div class="form-group">
                                                    <label for="reservation_time"
                                                        class="form-label fs-7 mb-1"><?php echo e(trans('labels.time')); ?>

                                                        <span class="text-danger">*</span>
                                                    </label>
                                                    <input class="form-control" type="time" name="time"
                                                        value="<?php echo e(old('time')); ?>" id="reservation_time" required>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row g-md-2 g-3 mb-3">
                                            <div class="col-xl-6 col-md-6">
                                                <div class="form-group">
                                                    <label for="reservation_guest"
                                                        class="form-label fs-7 mb-1"><?php echo e(trans('labels.number_guest')); ?>

                                                        <span class="text-danger">*</span>
                                                    </label>
                                                    <input class="form-control" type="text" name="guests"
                                                        value="<?php echo e(old('guests')); ?>" id="reservation_guest"
                                                        placeholder="<?php echo e(trans('labels.number_guest')); ?>" required>
                                                </div>
                                            </div>
                                            <div class="col-xl-6 col-md-6">
                                                <div class="form-group">
                                                    <label for="reservation_type"
                                                        class="form-label fs-7 mb-1"><?php echo e(trans('labels.reservation_type')); ?>

                                                        <span class="text-danger">*</span>
                                                    </label>
                                                    <input class="form-control" type="text" name="reservation_type"
                                                        value="<?php echo e(old('reservation_type')); ?>" id="reservation_type"
                                                        placeholder="<?php echo e(trans('labels.reservation_type')); ?>" required>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="form-group">
                                            <label for="special_request"
                                                class="form-label fs-7 mb-1"><?php echo e(trans('labels.special_request')); ?></label>
                                            <textarea class="form-control" name="special_request" id="special_request"
                                                placeholder="<?php echo e(trans('labels.special_request_o')); ?>" rows="3"><?php echo e(old('special_request')); ?></textarea>
                                        </div>
                                    </div>
                                    <div class="col-12 d-flex justify-content-center mt-3">
                                        <button type="submit"
                                            class="btn px-md-5 py-md-3 btn-primary float-end"><?php echo e(trans('labels.submit')); ?></button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="col-md-6 d-lg-block d-none table-booking-1 p-0">
                        <img src="<?php echo e(helper::image_path(@helper::appdata()->booknow_bg_image)); ?>"
                            class="w-100 object-fit-cover rounded-5" alt="table booking">
                    </div>
                </div>
            </div>
        </section>
    <?php endif; ?>
    <!-- Table Resrvation Section End Here -->


    <!-- todayspecial Dishes Section Start Here -->
    <?php if(count($todayspecial) > 0): ?>
        <section class="menu-special sec-padding position-relative">
            <div class="container">
                <div class="row g-3 align-items-center justify-content-between mb-sm-5 mb-4">
                    <div class="col-auto menu-heading">
                        <h1 class="text-uppercase"><?php echo e(trans('labels.todays_special')); ?></h1>
                        <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.top_special')); ?></p>
                    </div>
                    <div class="col-auto">
                        <a href="<?php echo e(URL::to('/view-all?type=todayspecial')); ?>"
                            class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?></a>
                    </div>
                </div>
                <?php if(helper::appdata()->product_card_view == 1): ?>
                    <div class="row row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4 menu-special">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 2): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 3): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-3-card">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 4): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-4-list">
                                <?php echo $__env->make('web.product_card.list_view.listview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 5): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 6): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 7): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 8): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $todayspecial; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.list_view.listview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php endif; ?>
            </div>
            <div class="tomato-shape-2 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/tomato-shape.png')); ?>"
                    alt="shape-img">
            </div>
            <div class="chili-shape-2 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/chili-shape.png')); ?>"
                    alt="shape-img">
            </div>
        </section>
    <?php endif; ?>
    <!-- todayspecial Dishes Section End Here -->

    <!-- Promotional bannersection2 Start Here -->
    <?php if(count($banners['bannersection2']) > 0): ?>
        <section class="banner1">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-md-12 col-sm-12">
                        <div id="bannersection2" class="owl-carousel">
                            <?php $__currentLoopData = $banners['bannersection2']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $bannerdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <div class="post-slide">
                                    <div class="post-img">
                                        <?php if($bannerdata['item_info'] != ''): ?>
                                            <a href="<?php echo e(URL::to('/item-' . $bannerdata['item_info']->slug)); ?>">
                                            <?php elseif($bannerdata['category_info'] != ''): ?>
                                                <a
                                                    href="<?php echo e(URL::to('/menu/?category=' . $bannerdata['category_info']->slug)); ?>">
                                                <?php else: ?>
                                                    <a href="javascript:void(0);">
                                        <?php endif; ?>
                                        <img src="<?php echo e($bannerdata['image']); ?>" alt="banner">
                                        </a>
                                    </div>
                                </div>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    <?php endif; ?>
    <!-- Promotional bannersection2 End Here -->


    <!-- App Download Section Start Here -->
    <?php if(@helper::checkaddons('ownerapp')): ?>
        <?php if(!empty(@helper::appdata()->mobile_app_image)): ?>
            <section class="sec-padding pb-0">
                <div class="app_download">
                    <div class="container">
                        <div class="bg-section-gray rounded-4">
                            <div class="row justify-content-center">
                                <div class="col-md-6 col-12 d-flex align-items-center position-relative">
                                    <div class="app_content">
                                        <h1 class="text-uppercase"><?php echo e(@helper::appdata()->mobile_app_title); ?></h1>
                                        <span class="text-muted"><?php echo e(@helper::appdata()->mobile_app_description); ?></span>
                                        <div class="mt-4 d-flex">
                                            <?php if(!@helper::appdata()->android == ''): ?>
                                                <a href="<?php echo e(@helper::appdata()->android); ?>" target="_blank">
                                                    <img src="<?php echo e(helper::web_image_path('playstore.png')); ?>"
                                                        width="100%" height="46" alt="">
                                                </a>
                                            <?php endif; ?>
                                            <?php if(!@helper::appdata()->ios == ''): ?>
                                                <a class="<?php echo e(session()->get('direction') == '2' ? 'me-3' : 'ms-3'); ?>"
                                                    href="<?php echo e(@helper::appdata()->ios); ?>" target="_blank">
                                                    <img src="<?php echo e(helper::web_image_path('appstore.svg')); ?>"
                                                        width="100%" height="46" alt="">
                                                </a>
                                            <?php endif; ?>
                                        </div>
                                    </div>
                                    <div class="fry-shape-3 d-xl-block d-none">
                                        <img src="https://modinatheme.com/html/foodking-html/assets/img/shape/fry-shape-2.png"
                                            alt="burger-shape">
                                    </div>
                                </div>
                                <div
                                    class="col-md-5 col-12 d-flex justify-content-center align-items-center app-screen p-5 d-md-block d-none">
                                    <img src="<?php echo e(helper::image_path(@helper::appdata()->mobile_app_image)); ?>"
                                        alt="app-screen" class="w-100 object-fit-cover">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>
    <?php endif; ?>
    <!-- App Download Section End Here -->

    <!-- recommended Section Start Here -->
    <?php if(count($recommended) > 0): ?>
        <section class="menu sec-padding position-relative">
            <div class="container">
                <div class="row g-3 align-items-center justify-content-between mb-sm-5 mb-4">
                    <div class="col-auto menu-heading">
                        <h1 class="text-uppercase"><?php echo e(trans('labels.recommended')); ?></h1>
                        <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.top_recommended')); ?></p>
                    </div>
                    <div class="col-auto">
                        <a href="<?php echo e(URL::to('/view-all?type=recommended')); ?>"
                            class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?></a>
                    </div>
                </div>
                <?php if(helper::appdata()->product_card_view == 1): ?>
                    <div class="row row-cols-xl-3 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col menu">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 2): ?>
                    <div
                        class="row row-cols-xl-3 theme-2-card row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-menu special">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-2-menu">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 3): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-3">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 4): ?>
                    <div class="row row-cols-xxl-5 row-cols-xl-4 row-cols-lg-4 row-cols-md-3 row-cols-sm-2 row-cols-2 g-3">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col theme-4">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 5): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 6): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 7): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php elseif(helper::appdata()->product_card_view == 8): ?>
                    <div class="row row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-sm-2 row-cols-1 g-3">
                        <?php $__currentLoopData = $recommended; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <div class="col">
                                <?php echo $__env->make('web.product_card.grid_view.gridview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            </div>
                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                    </div>
                <?php endif; ?>
            </div>
            <div class="tomato-shape-3 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/tomato-shape.png')); ?>"
                    alt="shape-img">
            </div>
            <div class="chili-shape-3 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/chili-shape.png')); ?>"
                    alt="shape-img">
            </div>
        </section>
    <?php endif; ?>
    <!-- recommended Section End Here -->

    <!-- Promotional bannersection3 Start Here -->
    <?php if(count($banners['bannersection3']) > 0): ?>
        <section class="banner2">
            <div id="banner3" class="carousel slide carousel-fade" data-bs-ride="carousel">
                <div class="carousel-inner">
                    <?php $__currentLoopData = $banners['bannersection3']; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $bannerdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="carousel-item <?php echo e($key == 0 ? 'active' : ''); ?>">
                            <?php if($bannerdata['item_info'] != ''): ?>
                                <a href="<?php echo e(URL::to('/item-' . $bannerdata['item_info']->slug)); ?>">
                                <?php elseif($bannerdata['category_info'] != ''): ?>
                                    <a href=" <?php echo e(URL::to('/menu/?category=' . $bannerdata['category_info']->slug)); ?> ">
                                    <?php else: ?>
                                        <a href="javascript:void(0)">
                            <?php endif; ?>
                            <img src="<?php echo e($bannerdata['image']); ?>" height="400" alt="banner3">
                            </a>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
                <button class="carousel-control-prev <?php echo e(count($banners['bannersection3']) == 1 ? 'd-none' : ''); ?>"
                    type="button" data-bs-target="#banner3" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden"><?php echo e(trans('labels.previous')); ?></span>
                </button>
                <button class="carousel-control-next <?php echo e(count($banners['bannersection3']) == 1 ? 'd-none' : ''); ?>"
                    type="button" data-bs-target="#banner3" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden"><?php echo e(trans('labels.next')); ?></span>
                </button>
            </div>
        </section>
    <?php endif; ?>
    <!-- Promotional bannersection3 End Here -->

    <!-- Store Reviews Section Start Here -->
    <?php if(@helper::checkaddons('store_review')): ?>
        <?php if(count($storereviews) > 0): ?>
            <section class="testimonial position-relative bg-section-gray sec-padding">
                <div class="container">
                    <div class="row align-items-center justify-content-center ">
                        <div class="mb-sm-5 mb-4">
                            <h1 class="text-uppercase"><?php echo e(trans('labels.reviews')); ?></h1>
                            <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.store_reviews')); ?></p>
                        </div>
                        <div class="testimonial-1 owl-carousel owl-theme">
                            <?php $__currentLoopData = $storereviews; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $storereview): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <div class="item box p-sm-4 p-2">
                                    <div class="row gx-md-5 gx-0 gy-md-0 gy-3">
                                        <div class="col-md-12 testimonial-dec rounded-4">
                                            <img src="<?php echo e(helper::image_path($storereview->image)); ?>"
                                                class="testimonial-img rounded-4" alt="">
                                            <h4 class="text-capitalize fs-6 fw-600 mb-0 mt-3">
                                                <?php echo e($storereview->name); ?></h4>
                                            <p class="mt-2 text-muted"><?php echo e(Str::limit($storereview->comment, 100)); ?></p>
                                            <div class="review-star fs-7 fw-500 mt-3">
                                                <?php if($storereview->ratting == 1): ?>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                <?php elseif($storereview->ratting == 2): ?>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                <?php elseif($storereview->ratting == 3): ?>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                <?php elseif($storereview->ratting == 4): ?>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-regular fa-star fs-6"></i>
                                                <?php elseif($storereview->ratting == 5): ?>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                    <i class="fa-solid fa-star fs-6"></i>
                                                <?php endif; ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </div>
                    </div>
                </div>

                <div class="burger-shape-2 d-xl-block d-none">
                    <img src="https://modinatheme.com/html/foodking-html/assets/img/shape/burger-shape-3.png"
                        alt="burger-shape">
                </div>
                <div class="pizza-shape d-md-block d-none">
                    <img src="https://modinatheme.com/html/foodking-html/assets/img/shape/pizzashape.png"
                        alt="burger-shape">
                </div>
            </section>
        <?php endif; ?>
    <?php endif; ?>
    <!-- Store Reviews Section End Here -->

    <!-- Team Start Here -->
    <?php if(count($getteams) > 0): ?>
        <div class="team sec-padding ">
            <div class="container">
                <div class="row g-2 align-items-center justify-content-between mb-sm-5 mb-4">
                    <div class="gallery-heading col-auto menu-heading">
                        <h1 class="text-uppercase"><?php echo e(trans('labels.team')); ?></h1>
                        <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.our_team')); ?></p>
                    </div>
                    <div class="col-auto">
                        <a href="<?php echo e(URL::to('ourteam')); ?>"
                            class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?></a>
                    </div>
                </div>
                <div class="row g-sm-4 g-3">
                    <?php $__currentLoopData = $getteams; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $teamdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                        <div class="col-md-4 col-6">
                            <div class="team-card rounded-4 overflow-hidden">
                                <div class="member-img overflow-hidden position-relative">
                                    <img src="<?php echo e(helper::image_path($teamdata->image)); ?>"
                                        class="img-circle img-responsive" />
                                    <div class="team-social">
                                        <?php if($teamdata->fb != ''): ?>
                                            <div class="icons">
                                                <a href="<?php echo e($teamdata->fb); ?>" target="_blank">
                                                    <i class="fa-brands fa-facebook-f text-white"></i>
                                                </a>
                                            </div>
                                        <?php endif; ?>
                                        <?php if($teamdata->twitter != ''): ?>
                                            <div class="icons">
                                                <a href="<?php echo e($teamdata->twitter); ?>" target="_blank">
                                                    <i class="fa-brands fa-twitter text-white"></i>
                                                </a>
                                            </div>
                                        <?php endif; ?>
                                        <?php if($teamdata->insta != ''): ?>
                                            <div class="icons">
                                                <a href="<?php echo e($teamdata->insta); ?>" target="_blank">
                                                    <i class="fa-brands fa-instagram text-white"></i>
                                                </a>
                                            </div>
                                        <?php endif; ?>
                                        <?php if($teamdata->youtube != ''): ?>
                                            <div class="icons">
                                                <a href="<?php echo e($teamdata->youtube); ?>" target="_blank">
                                                    <i class="fa-brands fa-youtube text-white"></i>
                                                </a>
                                            </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <div class="member-details">
                                    <span class="member-name"><?php echo e($teamdata->name); ?></span>
                                    <p class="mb-0 fs-7 fw-500"><?php echo e($teamdata->designation); ?></p>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </div>
            </div>
        </div>
    <?php endif; ?>
    <!-- Team End Here -->

    <!-- Top Deal Section Start Here -->
    <?php if(count($topdealsproduct) > 0 && $topdeals != null): ?>
        <section class="theme-1-top-deal menu-special position-relative sec-padding bg-primary-rgb">
            <div class="container">
                <div class="row g-4">
                    <div class="col-12">
                        <div class="p-4 rounded-4 overflow-hidden">
                            <div class="deals-heading mb-md-0 mb-3 text-center">
                                <h1 class="text-uppercase"><?php echo e(trans('labels.deals')); ?></h1>
                                <p class="sub-lables text-capitalize mb-0 mt-md-2">
                                    <?php echo e(trans('labels.top_deals')); ?>

                                </p>
                            </div>
                            <div class="countdown d-flex justify-content-center gap-2 mt-3" id="countdown"></div>
                        </div>
                    </div>
                    <div class="col-12">
                        <?php if(helper::appdata()->product_card_view == 1): ?>
                            <div
                                class="row row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-sm-2 row-cols-1 g-4 menu-special">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_1', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 2): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-2-list">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_2', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 3): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3 theme-3-card">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_3', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 4): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col theme-4-list">
                                        <?php echo $__env->make('web.product_card.list_view.listview_4', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 5): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_5', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 6): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_6', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 7): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_7', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php elseif(helper::appdata()->product_card_view == 8): ?>
                            <div class="row row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-3">
                                <?php $__currentLoopData = $topdealsproduct; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $itemdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                    <div class="col">
                                        <?php echo $__env->make('web.product_card.list_view.listview_8', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                                    </div>
                                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                <div class="col-lg-auto text-center mt-5">
                    <a href="<?php echo e(URL::to('/view-all?type=topdeals')); ?>"
                        class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?>

                        <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
            <div class="tomato-shape-3 d-md-flex d-none">
                <img src="<?php echo e(url('storage/app/public/web-assets/images/theme-bg-image/tomato-shape.png')); ?>"
                    alt="shape-img">
            </div>
        </section>
    <?php endif; ?>
    <!-- Top Deal Section End Here -->

    <!-- FAQs Start Here -->
    <?php if(count($getfaqs) > 0): ?>
        <div class="faqs sec-padding">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-6">
                        <div class="row align-items-center mb-sm-5 mb-4">
                            <div class="gallery-heading col-auto menu-heading">
                                <h1 class="text-uppercase"><?php echo e(trans('labels.faq')); ?></h1>
                                <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.faq')); ?></p>
                            </div>
                        </div>
                        <div class="accordion" id="accordionfaq">
                            <?php $__currentLoopData = $getfaqs; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $faqdata): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" id="faq<?php echo e($key); ?>">
                                        <button
                                            class="accordion-button <?php echo e($key == 0 ? '' : 'collapsed'); ?> <?php echo e(session()->get('direction') == '2' ? 'rtl' : ''); ?> "
                                            type="button" data-bs-toggle="collapse"
                                            data-bs-target="#faqs<?php echo e($key); ?>" aria-expanded="true"
                                            aria-controls="faqs<?php echo e($key); ?>">
                                            <?php echo e($faqdata->title); ?>

                                        </button>
                                    </h2>
                                    <div id="faqs<?php echo e($key); ?>"
                                        class="accordion-collapse collapse <?php echo e($key == 0 ? 'show' : ''); ?>"
                                        aria-labelledby="faq<?php echo e($key); ?>" data-bs-parent="#accordionfaq">
                                        <div class="accordion-body">
                                            <?php echo e($faqdata->description); ?>

                                        </div>
                                    </div>
                                </div>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </div>
                    </div>
                    <div class="col-lg-6 col-12 d-md-block d-none">
                        <img src="<?php echo e(helper::image_path(@helper::appdata()->faqs_image)); ?>"
                            class="w-100 object-fit-cover rounded-4" alt="">
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>
    <!-- FAQs End Here -->


    <!-- Blog Section Start Here -->
    <?php if(@helper::checkaddons('blog')): ?>
        <?php if(count($getblogs) > 0): ?>
            <section>
                <div class="blog-wrapper sec-padding pt-0">
                    <div class="container">
                        <div class="row g-2 align-items-center justify-content-between mb-sm-5 mb-4">
                            <div class="col-auto blog-heading">
                                <h1 class="text-uppercase"><?php echo e(trans('labels.latest_blogs')); ?></h1>
                                <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.top_blogs')); ?></p>
                            </div>
                            <div class="col-auto">
                                <a href="<?php echo e(route('blogs')); ?>"
                                    class="btn btn-sm btn-outline-primary px-4 py-2 rounded-3"><?php echo e(trans('labels.view_all')); ?></a>
                            </div>
                        </div>
                        <div class="row g-sm-4 g-3">
                            <?php $__currentLoopData = $getblogs; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $bloglist): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                                <?php echo $__env->make('web.included.blogs.blogview', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        </div>
                    </div>
                </div>
            </section>
        <?php endif; ?>
    <?php endif; ?>
    <!-- Blog Section End Here -->

    <!-- slider-gallery start Here -->
    <?php if(count($getgalleries) > 0): ?>
        <section class="gallery pb-5 position-relative">
            <div class="container">
                <div class="row align-items-center mb-sm-5 mb-4">
                    <div class="gallery-heading col-auto menu-heading">
                        <h1 class="text-uppercase"><?php echo e(trans('labels.gallery')); ?></h1>
                        <p class="sub-lables text-capitalize mt-2 mb-0"><?php echo e(trans('labels.our_gallery')); ?></p>
                    </div>
                </div>
            </div>
            <div class="gallery-slider owl-carousel owl-theme">
                <?php $__currentLoopData = $getgalleries; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $image): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <div class="item" data-src="<?php echo e($image->image_url); ?>" data-fancybox="gallery"
                        data-thumb="<?php echo e($image->image_url); ?>">
                        <img src="<?php echo e(helper::image_path($image->image)); ?>" class="rounded-4" alt="">
                    </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </section>
    <?php endif; ?>
    <!-- slider-gallery end Here -->

    <?php echo $__env->make('web.subscribeform', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php $__env->stopSection(); ?>
<?php $__env->startSection('scripts'); ?>
    <!-- JS For Promotional Banner Section 1 -->



    <script>
        $(document).ready(function() {
            $("#news-slider ").owlCarousel({
                rtl: <?php if(session()->get('direction') == '2'): ?>
                    true
                <?php else: ?>
                    false
                <?php endif; ?> ,
                loop: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    400: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    600: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    800: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    1000: {
                        items: 3,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    1200: {
                        items: 3,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    }
                }
            });
        });
    </script>
    <!-- JS For Category Section -->
    <script>
        $(document).ready(function() {
            $("#category").owlCarousel({
                rtl: <?php if(session()->get('direction') == '2'): ?>
                    true
                <?php else: ?>
                    false
                <?php endif; ?> ,
                loop: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                    },
                    426: {
                        items: 3,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 15,
                    },
                    600: {
                        items: 4,
                        nav: false,
                        dots: false,
                        margin: 15,
                    },
                    800: {
                        items: 4,
                        nav: false,
                        dots: false,
                        margin: 10,
                    },
                    1025: {
                        items: 5,
                        dots: false,
                        nav: false,
                        loop: false,
                        arrows: true,
                        margin: 20,
                    },
                }
            });
        });
    </script>
    <!-- JS For Promotional Banner Section 3 -->
    <script>
        $(document).ready(function() {
            $("#bannersection2").owlCarousel({
                rtl: <?php if(session()->get('direction') == '2'): ?>
                    true
                <?php else: ?>
                    false
                <?php endif; ?> ,
                loop: true,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    400: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    600: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    800: {
                        items: 2,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    1000: {
                        items: 3,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    },
                    1200: {
                        items: 4,
                        nav: false,
                        dots: false,
                        arrow: true,
                        margin: 10,
                        loop: false,
                        // rewind: true
                    }
                }
            });
            $('.testimonial-1').owlCarousel({
                rtl: <?php if(session()->get('direction') == '2'): ?>
                    true
                <?php else: ?>
                    false
                <?php endif; ?> ,
                loop: true,
                margin: 20,
                nav: false,
                dots: true,
                autoplay: true,
                autoplayTimeout: 4000,
                responsive: {
                    0: {
                        items: 1
                    },
                    500: {
                        items: 1
                    },
                    1000: {
                        items: 2
                    },
                    1200: {
                        items: 2
                    },
                }
            });
            $('.slider-small').owlCarousel({
                rtl: <?php if(session()->get('direction') == '2'): ?>
                    true
                <?php else: ?>
                    false
                <?php endif; ?> ,
                loop: true,
                margin: 20,
                responsiveClass: true,
                nav: false,
                dots: false,
                autoplay: true,
                autoplaySpeed: 2000,
                autoplayTimeout: 5000,
                responsive: {
                    0: {
                        items: 2,
                        margin: 10

                    },
                    500: {
                        items: 2,
                        margin: 15

                    },
                    600: {
                        items: 2,
                        margin: 20

                    },
                    1000: {
                        items: 2,
                        margin: 20

                    }
                }
            });
        });
    </script>
    <!-- slider-gallery -->
    <script>
        $('.gallery-slider').owlCarousel({
            rtl: <?php if(session()->get('direction') == '2'): ?>
                true
            <?php else: ?>
                false
            <?php endif; ?> ,
            loop: true,
            margin: 10,
            responsiveClass: true,
            nav: false,
            dots: false,
            center: true,
            autoplay: true,
            slideTransition: 'linear',
            autoplaySpeed: 3000,
            smartSpeed: 3000,
            autoplayTimeout: 3000,
            responsive: {
                0: {
                    items: 1,
                },
                425: {
                    items: 2,
                },
                600: {
                    items: 3,
                },
                1000: {
                    items: 5,
                }
            }
        });
    </script>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('web.layout.default', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH E:\laragon\www\foodefy-code\resources\views/web/home1/index.blade.php ENDPATH**/ ?>