<div class="view-cart-bar-2">
    <section class="view-cart-bar d-none">
        <div class="container">
            <div class="row g-2 align-items-center">
                <div class="col-xl-6 col-md-6">
                    <div class="d-flex gap-3 align-items-center">
                        <div class="product-img">
                            <img src="{{ @helper::image_path($firstimage->image_name) }}" class="rounded">
                        </div>
                        <div class="item-heading">
                            <div class="d-flex icon gap-1 my-1 align-items-center">
                                <img @if ($getitemdata->item_type == 1) src="{{ helper::image_path('veg.svg') }}" @else src="{{ helper::image_path('nonveg.svg') }}" @endif
                                    alt="">
                                <span class="fs-6 m-0 fw-600 line-2">{{ $getitemdata->item_name }}</span>
                            </div>
                            <div class="d-flex align-items-center gap-1">
                                <p
                                    class="item-price mb-0 fw-500 fs-7 text-success subtotal_{{ $getitemdata['id'] }} m-0">
                                    {{ helper::currency_format($price) }}
                                </p>
                                @if ($original_price > $price)
                                    <del class="text-muted fw-500 fs-8">
                                        {{ helper::currency_format($original_price) }}
                                    </del>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6 col-md-6">
                    <div class="row g-3 align-items-center justify-content-end">
                        <div class="col-md-auto col-12">
                            <div class="d-flex align-items-center gap-2">
                                <div class="btn item-quantity">
                                    <button class="btn btn-sm item-quantity-minus"
                                        onclick="changeqty('{{ $getitemdata['slug'] }}','minus')">-</button>
                                    <input class="item-quantity-input item_qty_{{ $getitemdata['slug'] }}"
                                        type="text" value="1" readonly="">
                                    <button class="btn btn-sm item-quantity-plus"
                                        onclick="changeqty('{{ $getitemdata['slug'] }}','plus')">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4 col-sm-6 col-6">
                            <button
                                class="btn btn-secondary w-100 m-0 fs-7 fw-500 rounded-3 d-flex gap-3 justify-content-center align-items-center cart"
                                onclick="addtocart('{{ URL::to('addtocart') }}','{{ $getitemdata['id'] }}','0')">
                                {{ trans('labels.add_to_cart') }}
                                <div class="loader d-none cart_loader"></div>
                            </button>
                        </div>
                        <div class="col-md-4 col-sm-6 col-6">
                            @if (@helper::checkaddons('customer_login'))
                                @if (helper::appdata()->login_required == 1)
                                    <button
                                        class="btn btn-primary w-100 m-0 fs-7 fw-500 rounded-3 d-flex gap-3 justify-content-center align-items-center quick_order"
                                        @if (helper::appdata()->is_checkout_login_required == 1) onclick="showlogin()" @else  onclick="addtocart('{{ URL::to('addtocart') }}','{{ $getitemdata['id'] }}','1')" @endif>
                                        {{ trans('labels.quick_order') }}
                                        <div class="loader d-none quick_order_loader"></div>
                                    </button>
                                @else
                                    <button
                                        class="btn btn-primary w-100 m-0 fs-7 fw-500 rounded-3 d-flex gap-3 justify-content-center align-items-center quick_order"
                                        onclick="addtocart('{{ URL::to('addtocart') }}','{{ $getitemdata['id'] }}','1')">
                                        {{ trans('labels.quick_order') }}
                                        <div class="loader d-none quick_order_loader"></div>
                                    </button>
                                @endif
                            @else
                                <button
                                    class="btn btn-primary w-100 m-0 fs-7 fw-500 rounded-3 d-flex gap-3 justify-content-center align-items-center quick_order"
                                    onclick="addtocart('{{ URL::to('addtocart') }}','{{ $getitemdata['id'] }}','1')">
                                    {{ trans('labels.quick_order') }}
                                    <div class="loader d-none quick_order_loader"></div>
                                </button>
                            @endif
                        </div>
                        <div class="col-auto">
                            <button class="border rounded m-0 close-btn-view" id="closebtn-viewbar">
                                <i class="fa-regular fa-xmark fs-4"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</div>
