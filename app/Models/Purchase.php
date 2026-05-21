<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $table = 'purchases';
    protected $fillable = ['supplier_id', 'branch_id', 'reference_no', 'total_amount', 'discount_amount', 'tax_amount', 'grand_total', 'payment_status', 'payment_method', 'notes', 'created_by'];

    public function supplier_info()
    {
        return $this->hasOne('App\Models\Supplier', 'id', 'supplier_id');
    }
    public function items()
    {
        return $this->hasMany('App\Models\PurchaseItem', 'purchase_id', 'id');
    }
    public function creator()
    {
        return $this->hasOne('App\Models\User', 'id', 'created_by');
    }
}
