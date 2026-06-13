<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SaUserResource extends JsonResource
{
    /** Badge tone per admin role. */
    private const ROLE_TONE = [
        'Super Admin' => 'amber',
        'Admin' => 'teal',
        'Support' => 'blue',
        'Auditor' => 'violet',
        'Read-only' => 'neutral',
    ];

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => 'SA-' . str_pad((string) $this->id, 4, '0', STR_PAD_LEFT),
            'name' => $this->name,
            'email' => $this->email,
            'admin_role' => $this->admin_role,
            'admin_role_tone' => self::ROLE_TONE[$this->admin_role] ?? 'neutral',
            'two_fa' => (bool) $this->two_fa,
            'status' => $this->status,
            'last_active_at' => $this->last_active_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
