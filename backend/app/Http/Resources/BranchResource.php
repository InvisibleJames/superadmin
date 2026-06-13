<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BranchResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'province' => $this->province,
            'phone' => $this->phone,
            'status' => $this->status,
            'clinic' => $this->whenLoaded('clinic', fn () => $this->clinic ? [
                'id' => $this->clinic->id,
                'name' => $this->clinic->name,
            ] : null),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
