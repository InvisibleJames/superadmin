<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClinicResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'no' => $this->no,
            'name' => $this->name,
            'province' => $this->province,
            'status' => $this->status,
            'branches_count' => $this->branches_count ?? $this->branches()->count(),
            'patients_count' => $this->patients_count ?? $this->patients()->count(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
