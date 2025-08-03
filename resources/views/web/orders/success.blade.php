@extends('web.layout.default')
@section('content')
    <section class="success">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-12">
                    <div class="success-image">
                        <img src="{{ url(env('ASSETSPATHURL') . 'web-assets/images/success.gif') }}" alt="">
                    </div>
                    <div class="">
                        <h4 class="fw-600 mb-3">{{ trans('labels.order_placed') }}</h4>
                        <p>{{ trans('labels.order_success_desc') }}</p>
                    </div>
                    <div class="row g-3 justify-content-center mt-3">
                        <div class="col-sm-auto col-12">
                            <a href="{{ URL::to('/') }}"
                                class="btn w-100 btn-outline-dark px-4 py-2 text-capitalize">{{ trans('labels.continue_shopping') }}
                            </a>
                        </div>
                        @if (@helper::checkaddons('whatsapp_message'))
                            @if (whatsapp_helper::whatsapp_message_config()->order_created == 1)
                                @if (whatsapp_helper::whatsapp_message_config()->message_type == 2)
                                    <div class="col-sm-auto col-12">
                                        <a href="https://api.whatsapp.com/send?phone={{ whatsapp_helper::whatsapp_message_config()->whatsapp_number }}&text={{ @$whmessage }}"
                                            target="_blank"
                                            class="btn w-100 btn-success px-4 py-2 text-capitalize">{{ trans('labels.send_order_on_whatsapp') }}
                                        </a>
                                    </div>
                                @endif
                            @endif
                        @endif
                        @if (@helper::checkaddons('telegram_message'))
                            @if (@helper::telegramdata()->order_created == 1)
                                <div class="col-sm-auto col-12">
                                    <a href="{{ URL::to('telegram/' . $orderdata->order_number) }}"
                                        class="btn w-100 btn-info text-white px-4 py-2 text-capitalize">{{ trans('labels.send_order_on_telegram') }}
                                    </a>
                                </div>
                            @endif
                        @endif
                        <div class="col-sm-auto col-12">
                            <a href="{{ URL::to('/orders-' . $orderdata->order_number) }}"
                                class="btn w-100 btn-primary px-4 py-2 text-capitalize my--track">{{ trans('labels.track_order') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
@endsection
@section('scripts')
    <script>
        setTimeout(function(){
            let url = window.location.href;
            let newUrl = url.replace('success', 'orders')
            window.location.replace(newUrl);
        }, 4000);
    </script>
@endsection
