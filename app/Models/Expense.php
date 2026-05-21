<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $table = 'expenses';
    protected $fillable = ['title', 'amount', 'category', 'description', 'branch_id', 'receipt_image', 'created_by', 'expense_date'];

    public function creator()
    {
        return $this->hasOne('App\Models\User', 'id', 'created_by');
    }
}
