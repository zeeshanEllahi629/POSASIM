<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosHeldCart extends Model
{
    protected $table = 'pos_held_carts';
    protected $fillable = ['reference_no', 'cashier_id', 'customer_id', 'items', 'subtotal', 'tax_amount', 'discount_amount', 'total', 'notes', 'status'];

    protected $casts = [
        'items' => 'array',
    ];

    public function cashier_info()
    {
        return $this->hasOne('App\Models\User', 'id', 'cashier_id');
    }
    public function customer_info()
    {
        return $this->hasOne('App\Models\User', 'id', 'customer_id');
    }
}
