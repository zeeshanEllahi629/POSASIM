<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';
    protected $fillable = ['name', 'phone', 'email', 'address', 'company', 'notes', 'status'];

    public function purchases()
    {
        return $this->hasMany('App\Models\Purchase', 'supplier_id', 'id');
    }
}
