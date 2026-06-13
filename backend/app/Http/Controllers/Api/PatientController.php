<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PatientResource;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PatientController extends Controller
{
    /** Columns that may be sorted from the UI. */
    private const SORTABLE = [
        'name' => 'name',
        'status' => 'status',
        'created' => 'created_at',
        'last_visit' => 'last_visit_at',
    ];

    public function index(Request $request): JsonResponse
    {
        $query = Patient::query()->with(['clinic', 'branch']);

        $this->applyFilters($query, $request);

        $sort = $request->string('sort')->toString();
        $dir = $request->string('dir')->lower()->toString() === 'asc' ? 'asc' : 'desc';
        $column = self::SORTABLE[$sort] ?? 'created_at';
        $query->orderBy($column, $dir)->orderBy('id', 'desc');

        $perPage = max(1, min((int) $request->integer('per_page', 10), 100));

        return PatientResource::collection($query->paginate($perPage)->withQueryString())->response();
    }

    public function stats(Request $request): JsonResponse
    {
        $base = Patient::query();
        $this->applyFilters($base, $request, includeStatus: false);

        $monthStart = now()->startOfMonth();

        return response()->json([
            'total' => (clone $base)->count(),
            'active' => (clone $base)->where('status', 'active')->count(),
            'inactive' => (clone $base)->where('status', 'inactive')->count(),
            'new_this_month' => (clone $base)->where('created_at', '>=', $monthStart)->count(),
        ]);
    }

    public function show(Patient $patient): PatientResource
    {
        return new PatientResource($patient->load(['clinic', 'branch']));
    }

    public function store(Request $request): JsonResponse
    {
        $patient = Patient::create($this->validatePatient($request));

        return (new PatientResource($patient->load(['clinic', 'branch'])))->response()->setStatusCode(201);
    }

    public function update(Request $request, Patient $patient): PatientResource
    {
        $patient->update($this->validatePatient($request, $patient));

        return new PatientResource($patient->load(['clinic', 'branch']));
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $patient->delete();

        return response()->json(['message' => 'Patient deleted.']);
    }

    public function bulk(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'action' => ['required', Rule::in(['activate', 'deactivate', 'delete'])],
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:patients,id'],
        ]);

        $query = Patient::whereIn('id', $validated['ids']);

        $affected = match ($validated['action']) {
            'activate' => $query->update(['status' => 'active']),
            'deactivate' => $query->update(['status' => 'inactive']),
            'delete' => $query->delete(),
        };

        return response()->json(['message' => "{$affected} patient(s) updated.", 'affected' => $affected]);
    }

    private function applyFilters($query, Request $request, bool $includeStatus = true): void
    {
        if ($q = trim((string) $request->string('q'))) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('hn', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%");
            });
        }

        if ($includeStatus && ($status = $request->string('status')->toString()) && $status !== 'all') {
            $query->where('status', $status);
        }

        if (($gender = $request->string('gender')->toString()) && $gender !== 'all') {
            $query->where('gender', $gender);
        }

        if ($branchId = $request->integer('branch_id')) {
            $query->where('branch_id', $branchId);
        }
    }

    private function validatePatient(Request $request, ?Patient $patient = null): array
    {
        return $request->validate([
            'hn' => ['required', 'string', 'max:255', Rule::unique('patients', 'hn')->ignore($patient)],
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['nullable', Rule::in(['Male', 'Female'])],
            'age' => ['nullable', 'integer', 'min:0', 'max:150'],
            'clinic_id' => ['nullable', 'exists:clinics,id'],
            'branch_id' => ['nullable', 'exists:branches,id'],
            'phone' => ['nullable', 'string', 'max:64'],
            'last_visit_at' => ['nullable', 'date'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ]);
    }
}
