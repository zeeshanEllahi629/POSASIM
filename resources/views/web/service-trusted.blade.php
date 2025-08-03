@if (request()->is('item-*'))
    @if (@helper::checkaddons('trusted_badges'))
        <div class="col-12 my-3 p-3 border-top">
            <div class="row g-3 product-detile">
                @if (@helper::otherappdata()->trusted_badge_image_1)
                    <div class="col-lg-3 col-6">
                        <div class="service-content">
                            <img src="{{ helper::image_path(@helper::otherappdata()->trusted_badge_image_1) }}"
                                alt="">
                        </div>
                    </div>
                @endif
                @if (@helper::otherappdata()->trusted_badge_image_2)
                    <div class="col-lg-3 col-6">
                        <div class="service-content">
                            <img src="{{ helper::image_path(@helper::otherappdata()->trusted_badge_image_2) }}"
                                alt="">
                        </div>
                    </div>
                @endif
                @if (@helper::otherappdata()->trusted_badge_image_3)
                    <div class="col-lg-3 col-6">
                        <div class="service-content">
                            <img src="{{ helper::image_path(@helper::otherappdata()->trusted_badge_image_3) }}"
                                alt="">
                        </div>
                    </div>
                @endif
                @if (@helper::otherappdata()->trusted_badge_image_4)
                    <div class="col-lg-3 col-6">
                        <div class="service-content">
                            <img src="{{ helper::image_path(@helper::otherappdata()->trusted_badge_image_4) }}"
                                alt="">
                        </div>
                    </div>
                @endif
            </div>
        </div>
    @endif
@endif

@if (@helper::checkaddons('safe_secure_checkout'))
    @if (@helper::otherappdata()->safe_secure_checkout_payment_selection)
        @if (request()->is('item-*'))
            <div class="col-12 py-4 p-3 sevirce-trued mt-3">
            @else
                <div class="col-12 py-4 p-3 my-3 rounded-3 sevirce-trued">
        @endif
        <div class="d-flex mb-2 pb-1 flex-wrap gap-2 justify-content-center aling-items-center">
            @foreach (helper::paymentlist() as $stpayment)
                @if (@in_array($stpayment->payment_type, explode(',', helper::otherappdata()->safe_secure_checkout_payment_selection)))
                    <div class="sevirce-tru">
                        <div class="img">
                            <img class="border rounded-2" src="{{ helper::image_path($stpayment->image) }}"
                                alt="">
                        </div>
                    </div>
                @endif
            @endforeach
        </div>
        <h6 class="fs-15 text-center fw-normal"
            style="color: {{ @helper::otherappdata()->safe_secure_checkout_text_color }}">
            {{ @helper::otherappdata()->safe_secure_checkout_text }}
        </h6>
        </div>
    @endif
@endif
