<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
    protected $table = 'purchase_items';
    protected $fillable = ['purchase_id', 'product_id', 'quantity', 'cost_price', 'total'];

    public function product_info()
    {
        return $this->hasOne('App\Models\Item', 'id', 'product_id');
    }
}
