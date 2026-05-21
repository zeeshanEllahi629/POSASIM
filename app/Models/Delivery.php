<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $table = 'deliveries';
    protected $fillable = ['order_id', 'driver_id', 'delivery_status', 'delivery_address', 'delivery_notes', 'delivery_fee', 'assigned_at', 'picked_up_at', 'delivered_at'];

    public function order_info()
    {
        return $this->hasOne('App\Models\Order', 'id', 'order_id');
    }
    public function driver_info()
    {
        return $this->hasOne('App\Models\User', 'id', 'driver_id');
    }
}
