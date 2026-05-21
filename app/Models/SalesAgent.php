<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesAgent extends Model
{
    protected $table = 'sales_agents';
    protected $fillable = ['user_id', 'target_amount', 'commission_rate', 'branch_id', 'status'];

    public function user_info()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }
}
