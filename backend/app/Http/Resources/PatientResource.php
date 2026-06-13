<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => 'PT-' . str_pad((string) $this->id, 5, '0', STR_PAD_LEFT),
            'hn' => $this->hn,
            'name' => $this->name,
            'gender' => $this->gender,
            'age' => $this->age,
            'phone' => $this->phone,
            'status' => $this->status,
            'last_visit_at' => $this->last_visit_at?->toIso8601String(),
            'clinic' => $this->whenLoaded('clinic', fn () => $this->clinic ? [
                'id' => $this->clinic->id,
                'name' => $this->clinic->name,
            ] : null),
            'branch' => $this->whenLoaded('branch', fn () => $this->branch ? [
                'id' => $this->branch->id,
                'name' => $this->branch->name,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
