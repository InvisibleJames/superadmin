<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SaUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'admin_role', 'two_fa', 'status', 'last_active_at',
    ];

    protected function casts(): array
    {
        return [
            'two_fa' => 'boolean',
            'last_active_at' => 'datetime',
        ];
    }
}
