<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $table = 'branches';
    protected $fillable = ['name', 'address', 'phone', 'email', 'manager_id', 'status'];

    public function manager()
    {
        return $this->hasOne('App\Models\User', 'id', 'manager_id');
    }
    public function orders()
    {
        return $this->hasMany('App\Models\Order', 'branch_id', 'id');
    }
}
