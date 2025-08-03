@if(count($getitemlist) > 0)
<div class="row row-cols-xl-1 row-cols-lg-1 row-cols-md-2 row-cols-sm-2 row-cols-1 g-1 menu-special">
    @foreach ($getitemlist as $itemdata)
        <div class="col-md-12 mb-2">
            @include('web.product_card.list_view.listview_1_alt')
        </div>
    @endforeach
</div>
@else
        @include('web.nodata')
@endif