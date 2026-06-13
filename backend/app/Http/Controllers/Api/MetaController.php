<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Clinic;
use App\Models\Role;
use Illuminate\Http\JsonResponse;

class MetaController extends Controller
{
    /**
     * Reference data for filter dropdowns and forms.
     */
    public function index(): JsonResponse
    {
        $provinces = Clinic::query()
            ->whereNotNull('province')
            ->distinct()
            ->orderBy('province')
            ->pluck('province')
            ->map(fn ($p) => ['value' => $p, 'label' => $p])
            ->values();

        return response()->json([
            'roles' => Role::orderBy('level')->get(['id', 'name', 'hue']),
            'clinics' => Clinic::orderBy('name')->get(['id', 'name']),
            'branches' => Branch::orderBy('name')->get(['id', 'name', 'clinic_id']),
            'provinces' => $provinces,
            'genders' => [
                ['value' => 'all', 'label' => 'All'],
                ['value' => 'Male', 'label' => 'Male'],
                ['value' => 'Female', 'label' => 'Female'],
            ],
            'statuses' => [
                ['value' => 'all', 'label' => 'All'],
                ['value' => 'active', 'label' => 'Active'],
                ['value' => 'inactive', 'label' => 'Inactive'],
            ],
        ]);
    }
}
