<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';
    protected $fillable = ['user_id', 'action', 'module', 'description', 'ip_address', 'user_agent'];

    public function user_info()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }
}
