<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $table = 'contact';
    protected $fillable = ['firstname', 'lastname', 'email', 'message'];
    public function products()
    {
        return $this->hasOne('App\Models\Item', 'id', 'product_id');
    }
}
