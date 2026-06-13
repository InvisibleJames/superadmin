<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ClinicResource;
use App\Models\Branch;
use App\Models\Clinic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClinicController extends Controller
{
    /** Columns that may be sorted from the UI. */
    private const SORTABLE = [
        'name' => 'name',
        'status' => 'status',
        'created' => 'created_at',
        'patients' => 'patients_count',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Clinic::query()->withCount(['branches', 'patients']);

        $this->applyFilters($query, $request);

        $sort = $request->string('sort')->toString();
        $dir = $request->string('dir')->lower()->toString() === 'asc' ? 'asc' : 'desc';
        $column = self::SORTABLE[$sort] ?? 'created_at';
        $query->orderBy($column, $dir)->orderBy('id', 'desc');

        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));

        return ClinicResource::collection($query->paginate($perPage)->withQueryString())->response();
    }

    public function stats(Request $request): JsonResponse
    {
        $base = Clinic::query();
        $this->applyFilters($base, $request, includeStatus: false);

        return response()->json([
            'total' => (clone $base)->count(),
            'active' => (clone $base)->where('status', 'active')->count(),
            'inactive' => (clone $base)->where('status', 'inactive')->count(),
            'branches' => Branch::count(),
        ]);
    }

    public function show(Clinic $clinic): ClinicResource
    {
        return new ClinicResource($clinic->loadCount(['branches', 'patients']));
    }

    public function store(Request $request): JsonResponse
    {
        $clinic = Clinic::create($this->validateClinic($request));

        return (new ClinicResource($clinic->loadCount(['branches', 'patients'])))->response()->setStatusCode(201);
    }

    public function update(Request $request, Clinic $clinic): ClinicResource
    {
        $clinic->update($this->validateClinic($request, $clinic));

        return new ClinicResource($clinic->loadCount(['branches', 'patients']));
    }

    public function destroy(Clinic $clinic): JsonResponse
    {
        $clinic->delete();

        return response()->json(['message' => 'Clinic deleted.']);
    }

    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'deactivate', 'delete'])],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:clinics,id'],
        ]);

        $query = Clinic::whereIn('id', $validated['ids']);

        $affected = match ($validated['action']) {
            'activate' => $query->update(['status' => 'active']),
            'deactivate' => $query->update(['status' => 'inactive']),
            'delete' => $query->delete(),
        };

        return response()->json(['message' => "{$affected} clinic(s) updated.", 'affected' => $affected]);
    }

    private function applyFilters($query, Request $request, bool $includeStatus = true): void
    {
        if ($q = trim((string) $request->string('q'))) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('code', 'like', "%{$q}%")
                    ->orWhere('province', 'like', "%{$q}%");
            });
        }

        if ($includeStatus && ($status = $request->string('status')->toString()) && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($province = trim((string) $request->string('province'))) {
            if ($province !== 'all') {
                $query->where('province', $province);
            }
        }
    }

    private function validateClinic(Request $request, ?Clinic $clinic = null): array
    {
        return $request->validate([
            'code' => ['required', 'string', 'max:255', Rule::unique('clinics', 'code')->ignore($clinic)],
            'no' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'province' => ['nullable', 'string', 'max:255'],
            'district' => ['nullable', 'string', 'max:255'],
            'subdistrict' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:10'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
