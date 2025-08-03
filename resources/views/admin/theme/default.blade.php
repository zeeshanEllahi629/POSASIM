<!DOCTYPE html>
<html lang="en" dir="{{ session('direction') == 2 ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ @helper::appdata()->title }} | {{ trans('labels.admin_title') }}</title>
    <link rel="icon" type="image/png" sizes="16x16" href="{{ helper::image_path(@helper::appdata()->favicon) }}">
    <link rel="stylesheet"
        href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/bootstrap/bootstrap.min.css') }}">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/fontawesome/all.min.css') }}">
    <!-- FontAwesome CSS -->
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/toastr/toastr.min.css') }}">
    <!-- Toastr CSS -->
    <link rel="stylesheet"
        href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/sweetalert/sweetalert2.min.css') }}">
    <!-- Sweetalert CSS -->
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/style.css') }}">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/responsive.css') }}">
    <!-- Responsive CSS -->
    <link rel="stylesheet"
        href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/datatables/dataTables.bootstrap5.min.css') }}">
    <!-- dataTables css -->
    <link rel="stylesheet"
        href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/datatables/dataTables.bootstrap5.min.css') }}">
    <!-- dataTables css -->
    <link rel="stylesheet"
        href="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/css/datatables/buttons.dataTables.min.css') }}">
    <!-- dataTables css -->
    <style>
        :root {
            --bs-primary: {{ @helper::appdata()->admin_primary_color != null ? @helper::appdata()->admin_primary_color : '#01112B' }};
            --bs-secondary: {{ @helper::appdata()->admin_secondary_color != null ? @helper::appdata()->admin_secondary_color : '#0a98af' }};
        }
    </style>
    @yield('styles')
</head>

<body>
    <main>
        <div class="wrapper">
            @include('admin.theme.header')
            <div class="content-wrapper">
                @include('admin.theme.sidebar')
                <div class="{{ session()->get('direction') == 2 ? 'main-content-rtl' : 'main-content' }}">
                    <div class="page-content">
                        @if (helper::check_alert() == 0)
                            <div class="alert alert-danger text-center">
                                <a href="{{ URL::to('admin/settings') }}" class="text-dark"> <i class="fa fa-cog"></i>
                                    {{ trans('messages.settings_note') }}</a>
                            </div>
                        @endif
                        @yield('content')
                    </div>
                </div>
            </div>

            <footer class="py-3 text-center bg-white fixed-bottom border-top">{{ helper::appdata()->copyright }}
            </footer>
        </div>
    </main>

    <div class="modal fade modalitemdetails" id="modalitemdetails" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-md modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" id="modalitem_body">
            </div>
        </div>
    </div>

    <div class="modal fade" id="orderButton" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" id="OrderNowContainer"></div>
        </div>
    </div>

    <!-- POS Invoice Model -->
    <div class="modal fade" id="pos-invoice" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div
                    class="modal-body d-flex justify-content-center align-items-center position-relative flex-column line-2">
                    <img src="{{ url('storage/app/public/admin-assets/images/success.svg') }}" alt=""
                        class="w-50 object">
                    <h5 class="mt-3 m-0 fw-medium line-2 text-center text-dark">{{ trans('labels.thank_you_title') }}
                    </h5>
                    <p class="text-center m-0 fs-13 mt-3 line-2 lh-lg">{{ trans('labels.thank_you_note') }}</p>
                </div>
                <div class="modal-footer p-4 border-0 justify-content-center">
                    <div class="col-12 m-0">
                        <div class="row gx-2 flex-wrap align-items-center justify-content-between">
                            <div class="col-md-6 order_success">
                                <a type="button" id="order_id" target="new"
                                    class="rounded border fw-500 border-dark fs-13 total-pay text-dark text-center bg-gray mt-2 mt-lg-0">{{ trans('labels.print') }}</a>
                            </div>
                            <div class="col-md-6 order_success">
                                <a href="{{ URL::to('/admin/pos/items') }}"
                                    class="fw-500 rounded btn-primary btn fs-13 total-pay mt-2 mt-lg-0">{{ trans('labels.continue_shopping') }}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- POS ENd Invoice -->

    <!-- MODAL_SELECTED_ADDONS--START -->
    <div class="modal addons" id="modal_selected_addons" tabindex="-1" aria-labelledby="selected_addons_Label"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header justify-content-between">
                    <div class="pro-name d-flex gap-1 align-items-center">
                        <p class="mb-0 fw-600 fs-5" id="addon_item_name"></p>
                    </div>
                    <button type="button"
                        class="btn-close m-0 {{ session()->get('direction') == 2 ? 'close m-0' : '' }}"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body p-0">
                    <!-- Addons -->
                    <div class="p-3 d-none" id="addons">
                        <p class="m-0 fs-6 fw-500">{{ trans('labels.addons') }}</p>
                        <ul class="m-0 {{ session()->get('direction') == '2' ? 'pe-2' : 'ps-2' }}" id="item-addons">
                        </ul>
                    </div>
                    <!-- Extras -->
                    <div class="p-3 pt-0 d-none" id="extras">
                        <p class="m-0 fs-6 fw-500">{{ trans('labels.extras') }} </p>
                        <ul class="m-0 {{ session()->get('direction') == '2' ? 'pe-2' : 'ps-2' }}" id="item-extras">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- MODAL_SELECTED_ADDONS--END -->

    <!-- Customer and Bill info Modal-->
    <div class="modal fade" id="customerinfo" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header justify-content-between">
                    <h5 class="modal-title" id="modalbankdetailsLabel">{{ trans('labels.edit') }}</h5>
                    <button type="button" class="btn-close m-0" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form enctype="multipart/form-data" action="{{ URL::to('admin/orders/customerbillinfo') }}"
                    method="POST">
                    <div class="modal-body">
                        @csrf
                        <input type="hidden" name="order_id" id="modal_order_id" class="form-control"
                            value="">
                        <input type="hidden" name="edit_type" id="edit_type" class="form-control" value="">
                        <div id="customer_info">
                            <div class="form-group col-md-12">
                                <label for="user_name"> {{ trans('labels.name') }} </label>
                                <div class="controls">
                                    <input type="text" name="user_name" id="user_name" class="form-control"
                                        required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="user_mobile"> {{ trans('labels.mobile') }} </label>
                                <div class="controls">
                                    <input type="text" name="user_mobile" id="user_mobile" class="form-control"
                                        required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="user_email"> {{ trans('labels.email') }} </label>
                                <div class="controls">
                                    <input type="text" name="user_email" id="user_email" class="form-control"
                                        required>
                                </div>
                            </div>
                        </div>

                        <div id="bill_info">
                            <div class="form-group col-md-12">
                                <label for="bill_address"> {{ trans('labels.address') }} </label>
                                <div class="controls">
                                    <input type="text" name="bill_address" id="bill_address" class="form-control"
                                        required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="bill_city"> {{ trans('labels.city') }} </label>
                                <div class="controls">
                                    <input type="text" name="bill_city" id="bill_city" class="form-control"
                                        required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="bill_state"> {{ trans('labels.state') }} </label>
                                <div class="controls">
                                    <input type="text" name="bill_state" id="bill_state" class="form-control"
                                        required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="bill_country"> {{ trans('labels.country') }} </label>
                                <div class="controls">
                                    <input type="text" name="bill_country" id="bill_country" class="form-control"
                                        required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="bill_landmark"> {{ trans('labels.landmark') }} </label>
                                <div class="controls">
                                    <input type="text" name="bill_landmark" id="bill_landmark"
                                        class="form-control" required>
                                </div>
                            </div>
                            <div class="form-group col-md-12">
                                <label for="bill_pincode"> {{ trans('labels.pincode') }} </label>
                                <div class="controls">
                                    <input type="text" name="bill_pincode" id="bill_pincode" class="form-control"
                                        required>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger"
                            data-bs-dismiss="modal">{{ trans('labels.close') }}</button>
                        <button
                            @if (env('Environment') == 'sendbox') type="button" onclick="myFunction()" type="submit" @endif
                            class="btn btn-primary"> {{ trans('labels.save') }} </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Payment_Modal START-->
    <div class="modal fade" id="paymentModal" tabindex="-1" aria-labelledby="paymentModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="paymentModalLabel">{{ trans('labels.payment') }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action=" {{ URL::to('admin/orders/payment_status-' . '2') }}" method="post"
                    enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div id="cod_payment">
                            <input type="hidden" id="order_number" name="order_number" value="">
                            <label for="modal_total_amount" class="form-label">
                                {{ trans('labels.total') }} {{ trans('labels.amount') }}
                            </label>
                            <input type="text" class="form-control numbers_only" name="modal_total_amount"
                                id="modal_total_amount" disabled value="">

                            <label for="modal_amount" class="form-label mt-2">
                                {{ trans('labels.cash_received') }}
                            </label>
                            <input type="text" class="form-control numbers_only" name="modal_amount"
                                id="modal_amount" value="" onkeyup="validation($(this).val())">
                            <label for="modal_amount" class="form-label mt-2">
                                {{ trans('labels.change_amount') }}
                            </label>
                            <input type="number" class="form-control" name="ramin_amount" id="ramin_amount"
                                value="" readonly>
                        </div>
                        <div id="bank_payment">
                            <img src='' id="bank_detail" class="w-100 h-100">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-secondary">{{ trans('labels.submit') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Payment_Modal END-->

    <!-- Order-Modal START -->
    <div class="modal fade" id="order-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-notify modal-info" role="document">
            <div class="modal-content text-center">
                <div class="modal-header d-flex justify-content-center">
                    <p class="heading">{{ trans('messages.be_up_to_date') }}</p>
                </div>
                <div class="modal-body"><i class="fa fa-bell fa-4x animated rotateIn mb-4"></i>
                    <p>{{ trans('messages.new_order_arrive') }}</p>
                </div>
                <div class="modal-footer flex-center">
                    <a role="button" class="btn btn-outline-secondary-modal btn-primary waves-effect"
                        onclick="window.location.reload();" data-bs-dismiss="modal">{{ trans('labels.okay') }}</a>
                </div>
            </div>
        </div>
    </div>
    <!-- Order-Modal END-->

    <!-- modal-add-table-number -->
    <div id="tablemodal" class="modal fade" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <label class="modal-title fw-bold">{{ trans('labels.accept') }}
                        {{ trans('labels.booking') }}</label>
                    <button type="button" class="btn-close {{ session()->get('direction') == 2 ? 'close' : '' }}"
                        data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label for="bookingid" class="col-form-label">{{ trans('labels.booking_number') }}</label>
                        <input type="hidden" class="form-control" id="bookingid" name="bookingid" readonly="">
                        <input type="text" class="form-control" id="booking_number" name="booking_number"
                            readonly="" placeholder="{{ trans('labels.booking_number') }}">
                    </div>
                    <div class="form-group">
                        <label for="category_id" class="col-form-label">{{ trans('labels.table_number') }}</label>
                        <input type="tel" class="form-control" name="table_number"
                            placeholder="{{ trans('labels.table_number') }}" id="table_number" required="required">
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger"
                        data-bs-dismiss="modal">{{ trans('labels.close') }}</button>
                    <button type="button" class="btn btn-primary booking_confirm"
                        @if (env('Environment') == 'sendbox') onclick="myFunction()" @else onclick="set_table_number('2','{{ URL::to('/admin/bookings/status') }}')" @endif>{{ trans('labels.save') }}</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Testmail-Modal-START -->
    <div class="modal fade" id="testmailmodal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        aria-labelledby="testmailmodalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <form action="{{ URL::to('/admin/testmail') }}" method="POST">
                @csrf
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="testmailmodalLabel">{{ trans('labels.send_test_mail') }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <label class="form-label">{{ trans('labels.email') }}<span class="text-danger"> *
                            </span></label>
                        <input type="text" class="form-control" name="email_address"
                            value="{{ @$settingdata->email_address }}" placeholder="{{ trans('labels.email') }}"
                            required>
                    </div>
                    <div class="modal-footer">
                        <button type="submit"
                            class="btn btn-secondary">{{ trans('labels.send_test_mail') }}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- Testmail-Modal-END -->

    <!-- Edit Item Images START -->
    <div class="modal fade" id="EditImages" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabeledit"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <form method="post" name="editimg" class="editimg" id="editimg" enctype="multipart/form-data">
                @csrf
                <input type="hidden" id="updateimageurl" value="{{ URL::to('admin/item/updateimage') }}">
                <input type="hidden" id="idd" name="id">
                <input type="hidden" class="form-control" id="old_img" name="old_img">
                <input type="hidden" name="removeimg" id="removeimg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabeledit">{{ trans('labels.images') }}</h5>
                        <button type="button"
                            class="btn-close {{ session()->get('direction') == 2 ? 'close' : '' }}"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <span id="emsg"></span>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>{{ trans('labels.images') }} <span class="text-danger">*</span></label>
                            <input type="file" class="form-control" name="image" id="image"
                                accept="image/*">
                        </div>
                        <div class="galleryim"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-danger"
                            data-bs-dismiss="modal">{{ trans('labels.close') }}</button>
                        <button class="btn btn-primary"
                            @if (env('Environment') == 'sendbox') type="button" onclick="myFunction()" @else type="submit" @endif>{{ trans('labels.save') }}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- Edit Item Images END -->

    <!-- Add Item Image START -->
    <div class="modal fade" id="AddProduct" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog" role="document">
            <form method="post" name="addproduct" class="addproduct" id="addproduct"
                enctype="multipart/form-data">
                <span id="msg"></span>
                <input type="hidden" id="storeimagesurl" value="{{ URL::to('admin/item/storeimages') }}">
                <input type="hidden" name="itemid" id="itemid" value="{{ request()->route('id') }}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{ trans('labels.images') }}</h5>
                        <button type="button"
                            class="btn-close {{ session()->get('direction') == 2 ? 'close' : '' }}"
                            data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <span id="iiemsg"></span>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-form-label">{{ trans('labels.images') }}
                                <span class="text-danger">*</span></label>
                            <input type="file" multiple="true" class="form-control" name="file[]"
                                id="file" accept="image/*" required="">
                        </div>
                        <div class="gallery"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-danger"
                            data-bs-dismiss="modal">{{ trans('labels.close') }}</button>
                        <button class="btn btn-primary"
                            @if (env('Environment') == 'sendbox') type="button" onclick="myFunction()" @else type="submit" @endif>{{ trans('labels.save') }}</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!-- Add Item Image END -->

    <!-- EDIT THEME IMAGE MODAL -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModallable" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header justify-content-between">
                    <h5 class="modal-title text-dark" id="editModallable">{{ trans('labels.image') }}<span
                            class="text-danger"> *
                        </span></h5>
                    <button type="button" class="btn-close m-0" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form action=" {{ URL::to('admin/settings/update') }}" method="post" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <input type="hidden" id="image_id" name="image_id">
                        <input type="file" name="theme_image" class="form-control" id="" required>
                    </div>
                    <div class="modal-footer">
                        <button
                            @if (env('Environment') == 'sendbox') type="button" onclick="myFunction()" @else type="submit" name="themeimage_update" value="1" @endif
                            class="btn px-sm-4 btn-primary">{{ trans('labels.save') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- EDIT CARD IMAGE MODAL -->
    <div class="modal fade" id="editcardModal" tabindex="-1" aria-labelledby="editcardModallable"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header justify-content-between">
                    <h5 class="modal-title text-dark" id="editcardModallable">{{ trans('labels.image') }}
                        <span class="text-danger"> * </span>
                    </h5>
                    <button type="button" class="btn-close m-0" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <form action=" {{ URL::to('admin/product_card') }}" method="post" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <input type="hidden" id="card_id" name="card_id">
                        <input type="file" name="card_image" class="form-control" id="" required>
                    </div>
                    <div class="modal-footer">
                        <button
                            @if (env('Environment') == 'sendbox') type="button" onclick="myFunction()" @else type="submit" name="themeimage_update" value="1" @endif
                            class="btn btn-primary px-4">{{ trans('labels.save') }}</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    @include('admin.theme.script')
    @if ($errors->any())
        @foreach ($errors->all() as $error)
            <script>
                toastr.error('{{ $error }}');
            </script>
        @endforeach
    @endif
    <script type="text/javascript">
        let are_you_sure = "{{ trans('messages.are_you_sure') }}";
        let yes = "{{ trans('messages.yes') }}";
        let no = "{{ trans('messages.no') }}";
        let wrong = "{{ trans('messages.wrong') }}";
        let cannot_delete = "{{ trans('messages.cannot_delete') }}";
        let last_image = "{{ trans('messages.last_image') }}";
        let record_safe = "{{ trans('messages.record_safe') }}";
        let select = "{{ trans('labels.select') }}";
        let variation = "{{ trans('labels.variation') }}";
        let enter_variation = "{{ trans('labels.variation') }}";
        let product_price = "{{ trans('labels.product_price') }}";
        let enter_product_price = "{{ trans('labels.product_price') }}";
        let sale_price = "{{ trans('labels.sale_price') }}";
        let enter_sale_price = "{{ trans('labels.sale_price') }}";

        function currency_format(price) {
            if ("{{ @helper::appdata()->currency_position }}" == 1) {
                return "{{ @helper::appdata()->currency }}" + parseFloat(price).toFixed(2);
            } else {
                return parseFloat(price).toFixed(2) + "{{ @helper::appdata()->currency }}";
            }
        }
        toastr.options = {
            "closeButton": true,
            "progressBar": true
        }
        @if (Session::has('success'))
            toastr.success("{{ session('success') }}");
        @endif
        @if (Session::has('error'))
            toastr.error("{{ session('error') }}");
        @endif
        // New Notification 
        var noticount = 0;
        (function noti() {
            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                url: "{{ url('admin/getorder') }}",
                method: 'GET', //Get method,
                dataType: "json",
                success: function(response) {
                    noticount = localStorage.getItem("count");
                    if (response.count > 9) {
                        $('#notificationcount').text(response.count + "+");
                    } else {
                        $('#notificationcount').text(response.count);
                    }
                    if (response.count != 0) {
                        if (noticount != response.count) {
                            localStorage.setItem("count", response.count);
                            jQuery("#order-modal").modal('show');
                            var audio = new Audio(
                                "{{ url(env('ASSETSPATHURL')) }}/admin-assets/notification/" +
                                response
                                .noti);
                            audio.play();
                        }
                    } else {
                        localStorage.setItem("count", response.count);
                    }
                    setTimeout(noti, 5000);
                }
            });
        })();
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
    <script src="{{ url(env('ASSETSPATHURL') . 'admin-assets/assets/js/common.js') }}"></script><!-- Common JS -->
    @yield('script')
</body>

</html>
