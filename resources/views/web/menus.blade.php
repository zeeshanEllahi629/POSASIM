@extends('web.layout.default')
@section('page_title')
    | {{ trans('labels.menu') }}
@endsection
@section('content')
    <style>
        body {
            overflow-x: hidden;
            background: none !important; /* clear default */
        }

        /*.fixed-sidebar {*/
        /*    position: fixed;*/
        /*    top: 106px; !* adjust based on your header *!*/
        /*    height: calc(100vh - 80px);*/
        /*    overflow-y: auto;*/
        /*}*/


        .left-sidebar {
            left: 8px;
            /*width: 25%; !* col-md-2 *!*/
        }
        .right-sidebar {
            right: 8px;
            /*width: 33%; !* col-md-3 *!*/
        }
        .main-content {
            margin-left: 16.6667%;
            margin-right: 25%;
            padding-top: 20px;
        }
    </style>
    <div class="menu-background">
        <div class="container-fluid py-4">
            <div class="row">

                <!-- Left: Categories -->
                <div class="col-md-3 mb-4">
                    <div class="fixed-sidebar left-sidebar">
                        <div class="card shadow-sm me-2">
                            <div class="card-header bg-white fw-bold">
                                Categories
                            </div>
                            <div class="card-body">
                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <div class="input-group">
                                            <input type="text" autocomplete="off" id="search" onkeyup="searchProduct(this)" class="form-control" placeholder="Search Menu">
                                            <span class="input-group-text bg-white">
                                                <i class="fas fa-search text-muted"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    @foreach (helper::get_categories() as $category)
                                        <div class="col-6 mb-3" onclick="productByCategory('{{$category->id}}')">
                                            <div class="card border-0 shadow-sm h-100" style="cursor: pointer;" >
                                                <img src="{{ helper::image_path($category->image) }}" class="card-img-top" alt="{{ $category->category_name }}" style="height: 100px; object-fit: cover;">
                                                <div class="card-body p-2 text-center bg-primary text-white fw-bold rounded-bottom">
                                                    {{ strtoupper($category->category_name) }}
                                                </div>
                                            </div>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Middle: Products -->
                <div class="col-md-5 mb-4 product--list">
                    @include('web.product_menu', [$getitemlist])
                </div>
                <!-- Right: Cart -->
                <div class="col-md-4 mb-4 mr-2">
                    <div class="fixed-sidebar right-sidebar">
                        <div class="card mb-3 order-option">
                            <div class="card-body">
                                <div class="">
                                    <div class="heading mb-2 border-bottom">
                                        <h5>{{ trans('labels.order_type') }}</h5>
                                    </div>
                                    <div class="col-12 d-flex gap-3">
                                    @if ($getsettings->pickup_delivery == 1)
                                        <!-- Hidden radio inputs for form submission -->
                                            <input type="radio" name="order_type" value="1" id="delivery" class="d-none" {{ session()->get('order_type') == 1 ? 'checked' : '' }}>
                                            <input type="radio" name="order_type" value="2" id="pickup" class="d-none" {{ session()->get('order_type') == 2 ? 'checked' : '' }}>

                                            <!-- Visible toggle buttons -->
                                            <button type="button" class="btn {{ session()->get('order_type') == 1 ? 'btn-primary' : 'btn-outline-primary' }}" onclick="selectOrderType('1')">
                                                {{ trans('labels.delivery') }}
                                            </button>
                                            <button type="button" class="btn {{ session()->get('order_type') == 2 ? 'btn-primary' : 'btn-outline-primary' }}" onclick="selectOrderType('2')">
                                                {{ trans('labels.take_away') }}
                                            </button>

                                        @elseif($getsettings->pickup_delivery == 2)
                                            <input type="radio" name="order_type" value="1" id="delivery" class="d-none" checked>
                                            <button type="button" class="btn btn-primary">
                                                {{ trans('labels.delivery') }}
                                            </button>

                                        @elseif($getsettings->pickup_delivery == 3)
                                            <input type="radio" name="order_type" value="2" id="pickup" class="d-none" checked>
                                            <button type="button" class="btn btn-primary">
                                                {{ trans('labels.take_away') }}
                                            </button>
                                        @endif
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card shadow-sm ms-2">
                            <div class="card-header bg-white fw-bold">
                                Your Cart
                            </div>
                            @if(count($getcartlist) == 0)
                            <div class="card-body text-center">
                                <img src="{{url(env('ASSETSPATHURL') . 'web-assets/images/empty-cart.png')}}" alt="Empty Cart" class="img-fluid mb-3" style="max-width: 120px;">
                                <h5 class="fw-semibold">Your cart is empty</h5>
                                <p class="text-muted small">Looks like you haven’t added anything yet.</p>

                            </div>
                            @else
                            <div class="card-body">
                                <!-- Cart Item -->
                                @php
                                    $order_total = 0;
                                    $total_item_qty = 0;
                                @endphp
                                @foreach ($getcartlist as $cartitems)
                                    @php
                                        $total_price =
                                            ($cartitems->item_price +
                                                $cartitems->addons_total_price +
                                                $cartitems->extras_total_price) *
                                            $cartitems->qty;
                                        $order_total += (float) $total_price;
                                        $total_item_qty += $cartitems->qty;
                                    @endphp
                                <div class="d-flex justify-content-between border-bottom pb-2 mb-2">
                                    <div>
                                        <div class="fw-semibold">{{ $cartitems->item_name }}
                                            @if ($cartitems->addons_id != '' || $cartitems->extras_id != '')
                                                <small>
                                                    <a class="text-muted fw-400 fs-7"
                                                       href="javascript:void(0)"
                                                       onclick="showaddons('{{ $cartitems['addons_name'] }}','{{ $cartitems['addons_price'] }}','{{ $cartitems['extras_name'] }}','{{ $cartitems['extras_price'] }}','{{ $cartitems['item_name'] }}')">{{ trans('labels.customize') }}
                                                    </a>
                                                </small>
                                                <br>
                                            @endif
                                        </div>

                                        <div class="text-muted small">{{ $cartitems->qty }} × {{ helper::currency_format($cartitems->item_price + $cartitems->addons_total_price + $cartitems->extras_total_price) }}</div>
                                    </div>
                                    <div class="fw-bold">{{ helper::currency_format($total_price) }}</div>
                                </div>
                                @endforeach
                                <textarea class="form-control" onkeyup="saveNote(this)" id="order_note" rows="3"
                                          placeholder="{{ trans('labels.leave_comments') }}"></textarea>

                                <!-- More cart items... -->
                                <div class="border-top pt-3 mt-3">
                                    <div class="d-flex justify-content-between fw-bold mb-3">
                                        <span>Total:</span>
                                        <span>{{ helper::currency_format($order_total) }}</span>
                                    </div>
                                    <small><strong>Note:</strong> Shipping, taxes, and discounts codes calculated at checkout. (if applicable)</small>
                                    <a href="javascript:void(0)" onclick="isOrderType(this)" class="btn btn-secondary w-100 mt-3">View Cart</a>
                                    <button type="button" onclick="isCheckoutOrderType('{{ URL::to('/isopenclose') }}','{{ $total_item_qty }}','{{ $order_total }}')" class="btn btn-primary w-100 mt-3">Checkout</button>
                                </div>
                            </div>
                            @endif
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>

@endsection

@section('scripts')
    <script src="{{ url(env('ASSETSPATHURL') . 'web-assets/js/custom/cart.js') }}"></script>
    <script>
        let myIsOrder = "{{session()->has('order_type')}}" ? true: false;
        function isOrderType(input) {
            if (!myIsOrder){
                $('#orderModal').modal('toggle');
                return;
            }
            window.location.replace('/cart');
        }

        function isCheckoutOrderType(route, itemQuantity, orderTotal){
            if (!myIsOrder){
                $('#orderModal').modal('toggle');
                return;
            }
            isopenclose(route, itemQuantity, orderTotal)
        }

        $(function () {
            $('.cart-modal').hide();
        });

        function searchProduct(input){
            let val = $(input).val().trim();
            if(val.length > 0){
                $.get(`/search-products/${val}`, function(res){
                    $('.product--list').empty().append(res);
                });
            }
            if(val.length == 0){
                $.get(`/search-products`, function(res){
                    $('.product--list').empty().append(res);
                });
            }
        }

        function productByCategory(categoryId){
            $.get(`/category-products/${categoryId}`, function(res){
                $('.product--list').empty().append(res);
            });
        }

        function saveNote(input){
            let value = $(input).val();
            localStorage.setItem('special_instructions', value);
        }

        function saveMyOrderType(val){
            myOrderType = val;
            saveLocation()
        }

        function selectOrderType(type) {
            // Update hidden radio
            document.getElementById('delivery').checked = (type === '1');
            document.getElementById('pickup').checked = (type === '2');

            // Save in session or perform AJAX if needed
            if(type == '1'){
                $('#orderModal').modal('show');
            }else{
                saveMyOrderType(type);
            }

            // Update button styles
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                if (btn.innerText.trim() === (type === '1' ? '{{ trans("labels.delivery") }}' : '{{ trans("labels.take_away") }}')) {
                    btn.classList.remove('btn-outline-primary');
                    btn.classList.add('btn-primary');
                } else if (btn.innerText.trim() === '{{ trans("labels.delivery") }}' || btn.innerText.trim() === '{{ trans("labels.take_away") }}') {
                    btn.classList.remove('btn-primary');
                    btn.classList.add('btn-outline-primary');
                }
            });
        }

    </script>
@endsection